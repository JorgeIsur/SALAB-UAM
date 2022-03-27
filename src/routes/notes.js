const req = require('express/lib/request');

const router = require('express').Router();

const Note = require('../models/Note');

const {isAuthenticated} = require('../helpers/auth');

router.get('/notes/add',isAuthenticated,(req,res)=>{
    res.render('notes/new-note');
});

router.post('/notes/new-note',isAuthenticated, async(req,res)=>{
    const { title, description}=req.body;
    const errors=[];
    if(!title){
        errors.push({text:'Please insert a title.'});
    }
    if(!description){
        errors.push({text:'Please insert a description'});
    }
    if(errors.length > 0){
        res.render('notes/new-note',{
            errors,
            title,
            description
        });
    }
    else{
        const newNote = new Note({title,description});
        newNote.user = req.user.id;
        await newNote.save();
        req.flash('success_msg','Nota agregada exitosamente.');
        res.redirect('/notes');
    }
});

router.get('/notes',isAuthenticated,async(req,res)=>{
    
    const notes = await Note.find({user:req.user.id}).lean().sort({date:'desc'});
    res.render('notes/all-notes',{notes});

});

router.get('/notes/edit/:id',async(req,res)=>{
    const note = await Note.findById(req.params.id).lean();
    res.render('notes/edit-note',{note});
});

router.put('/notes/edit-note/:id',async(req,res)=>{
    const {title,description} = req.body;
    await Note.findByIdAndUpdate(req.params.id,{title,description});
    req.flash('success_msg','Nota editada satisfactoriamente.');
    res.redirect('/notes');
});

router.delete('/notes/delete/:id',async(req,res)=>{
    await Note.findByIdAndDelete(req.params.id);
    req.flash('success_msg','Nota borrada satisfactoriamente.');
    res.redirect('/notes');
});

module.exports = router;