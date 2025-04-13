import express from "express";
import bcrypt from "bcrypt";

const app = express();
const port = 3000;


app.use(express.static('public'));

app.use(express.json());

const users = [];

app.get("/", (req, res) => {
  res.send("Hello from the API!");
});

app.use(express.json());
app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user by email
    const findUser = users.find((data) => email === data.email);

    if (findUser) {
      return res.status(400).send("message: User already exists");
    }

    // hash password
    const hashPassword = await bcrypt.hash(password, 10);
    users.push({ email, password: hashPassword });
    console.log(users);
    res.status(201).send("message: User created");
  } catch (err) {
    console.log(err);
    res.status(500).send("message: Server Error");
  }
});

// login

app.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const findUser = users.find((data) => email === data.email);
  
      if (!findUser) {
        return res.status(400).json({ success: false, message: "User not found" });
      }
  
      const passwordMatch = await bcrypt.compare(password, findUser.password);
      if (!passwordMatch) {
        return res.status(400).json({ success: false, message: "Wrong password" });
      }
  
      res.status(200).json({ success: true, message: "Login successful" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  });
  

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
