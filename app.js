const express = require("express");
const cors = require("cors");
const app = express();

const corsOptions = {
	origin: "*",
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");
db.mongoose
	.connect(db.url, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log("Connected to the database!" + db.url);
	})
	.catch((err) => {
		console.log("Cannot connect to the database!", err);
		process.exit();
	});
require("./app/routes/review.routes")(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}.`);
});
