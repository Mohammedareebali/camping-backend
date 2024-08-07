const jwt = require('jsonwebtoken');

const authMiddleware = async (req: { headers: { authorization: string; }; userId: any; }, res: {
  redirect: any; status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string; }): void; new(): any; }; }; 
}, next: () => void) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authorization failed. No token provided.' });
      
    }
    console.log(token)
    const decodedToken = jwt.verify(token, 'secret_key');
    const userId = decodedToken.userId;
    req.userId = userId;
    next();
  } catch (err:any) {
    if (err.name === 'TokenExpiredError') {
      return res.redirect('/login');
    } else {
      console.error(err);
      return res.status(401).json({ message: 'Authorization failed. Invalid token.' });
    }
  }
};

module.exports = authMiddleware;
