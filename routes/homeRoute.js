const express = require('express')
const router = express.Router()

router.get('/homeApi',(req , res)=>{
    res.json({
        ok:'ok'
    })
})

module.exports = router;