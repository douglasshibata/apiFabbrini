const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth.json');
module.exports = (req,res,next)=>{
    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).send({error:'Nenhum token informado'});
    }
    const parts = authHeader.split(' ');

    if(!parts.length===2){
        return res.status(401).send({error:"Erro no token"});
    }
    const [schema,token] = parts;

    if(!/^Bearer$/i.test(schema)){
        return res.status(401).send({error:"Token mal informado"})
    }
    jwt.verify(token,authConfig.secret,(err,decoded)=>{
        if(err){
            return res.status(401).send({error:'Token inválido'})
        }
        req.userId = decoded.id;
        return next();
        
    })
}