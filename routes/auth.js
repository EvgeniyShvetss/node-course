const {Router} = require("express");
const router = Router()
const keys = require('../keys')
const User = require("../models/user")
const bcrypt = require('bcryptjs')
const SibApiV3Sdk = require('@getbrevo/brevo');
const reqEmail = require('../emails/registration')
const reqEmailReset = require('../emails/reset')
const crypto = require("crypto")

let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

let apiKey = apiInstance.authentications['apiKey'];
apiKey.apiKey = keys.SEND_GRID_API_KEY;

let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); 

router.get('/login', (req, res) => {
    res.render('auth/login', {
        title: 'Auth',
        isLogin: true,
        error: req.flash('error')
    })
})

router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login')
    })
 
})

router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body
        const candidate = await User.findOne({email})
        if(candidate) {
            const samePsw = await bcrypt.compare(password, candidate.password)
            if(samePsw) {
                req.session.user = candidate
                req.session.isAuth = true
                req.session.save((err) => {
                    if(err) {
                        throw err
                    } else {
                        res.redirect('/')
                    }
                })
            } else {
                res.redirect('/auth/login#login')
            }
        } else {
            res.redirect('/auth/login#login')
        }
    } catch (error) {
        console.log(error);
    }
   
})

router.post('/register', async (req, res) => {
    try {
        const {email, password, repeat, name} = req.body
        const candidate = await User.findOne({email})
      

        if(candidate) {
            req.flash('error', 'This email already used')
            res.redirect('/auth/login#register')
        } else {
            const hashPsw = await bcrypt.hash(password, 10) 
            const user = new User({
                email, name, password: hashPsw, card: {items: []}
            })

            await user.save()
            res.redirect('/auth/login#login')
            await apiInstance.sendTransacEmail(reqEmail(email, name, sendSmtpEmail))
        }
    } catch (error) {
        console.log('register:', error);
    }
})


router.get('/reset', (req, res) => {
    res.render('auth/reset', {
        title: 'Forgot password?',
        error: req.flash('error')
    })
})

router.post('/reset', (req, res) => {
    try {
       crypto.randomBytes(32, async (err, buffer) => {
        if(err) {
            req.flash('error', 'Somthing weth wrong')
            return res.redirect('/auth/reset')
        }

        const token = buffer.toString('hex')
        const candidate = await User.findOne({email: req.body.email})

        if(candidate) {
            candidate.resetToken = token;
            candidate.resetTokenExp = Date.now() + 60 * 60 * 1000
            await candidate.save()
            await apiInstance.sendTransacEmail(reqEmailReset(candidate.email, candidate.name, sendSmtpEmail, token))
            res.redirect('/auth/login')
        } else {
            req.flash('error', 'Email not found')
            res.redirect('/auth/reset')
        }
       })
    } catch (error) {
        console.log('reset:', error);
    }
})


router.get('/password/:token', async (req, res) => {
    if(!req.params.token) {
       return res.redirect('/auth/login')
    }

    try {
        const user = await User.findOne({
            resetToken: req.params.token,
            resetTokenExp: {$gt: Date.now()}
        })

        if(!user) {
            return res.redirect('/auth/login')
        } else {
            res.render('auth/password', {
                title: 'Acces',
                error: req.flash('error'),
                userId: user._id.toString(),
                token: req.params.token,
            })
        }
    } catch (error) {
        console.log(error);
    }
})

router.post('/password', async (req, res) => {
    try {
        const user = await User.findOne({
            _id: req.body.userId,
            resetToken: req.body.token,
            resetTokenExp: {$gt: Date.now()}
        })

        if(user) {
            user.password = await bcrypt.hash(req.body.password, 10);
            user.resetToken = undefined;
            user.resetTokenExp = undefined;
            await user.save()
            return res.redirect('/auth/login')
        } else {
            req.flash('error', 'Token dead')
            return res.redirect('/auth/login')
        }

    
    } catch (error) {
        console.log('reset:', error);
    }
})



module.exports = router