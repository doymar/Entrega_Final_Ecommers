export const authMiddleware = (roles)=> {
  return (req,res,next)=> {
    if (!req.user) {
      return res.redirect("/login")
    }
    if(!roles.includes(req.user.role)){
      return res.status(403).json('Not authoraized')
    }
    next();
  }
}