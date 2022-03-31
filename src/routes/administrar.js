const router = require('express').Router();

const Prestamos = require('../models/Prestamos');

const {isAuthenticated} = require('../helpers/auth');

router.get('/administrar',isAuthenticated,async(req,res)=>{
    const prestamos = await Prestamos.find().lean();
    res.render('administrar/all-prestamos',{prestamos});
});

module.exports = router;