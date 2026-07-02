const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userCheck = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (userCheck.rows.length > 0) {
      return res.status(400).json({
        message: "Email already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users(name,email,password,role)
       VALUES($1,$2,$3,$4)
       RETURNING user_id,name,email,role`,
      [
        name,
        email,
        hashedPassword,
        role || "ADMIN"
      ]
    );

    res.status(201).json({
      message: "User registered successfully",
      user: result.rows[0]
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};


// Login

const login = async (req, res) => {

    try {

        const { email, password } = req.body;

        const result = await pool.query(
            "SELECT * FROM users WHERE email=$1",
            [email]
        );

        if(result.rows.length===0){

            return res.status(400).json({
                message:"Invalid Email"
            });

        }

        const user=result.rows[0];

        const match=await bcrypt.compare(
            password,
            user.password
        );

        if(!match){

            return res.status(400).json({
                message:"Invalid Password"
            });

        }

        const token=jwt.sign(

            {
                userId:user.user_id,
                email:user.email,
                role:user.role
            },

            process.env.JWT_SECRET,

            {
                expiresIn:"1d"
            }

        );

        res.json({

            message:"Login Successful",

            token,

            user:{
                user_id:user.user_id,
                name:user.name,
                email:user.email,
                role:user.role
            }

        });

    }

    catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};

module.exports = {
    register,
    login
};