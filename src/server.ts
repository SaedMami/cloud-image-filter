import express, { response } from "express";
import bodyParser from "body-parser";
import { filterImageFromURL, deleteLocalFiles } from "./util/util";
import axios from "axios";

(async () => {
  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */
  app.get("/filteredimage", async (req, res) => {
    // validate image url
    const imageUrl = req.query.image_url;
    if (!imageUrl || imageUrl.length == 0) {
      res
        .status(422)
        .send("Please provide a valid value for the image_url query");
    }
    // check that the url is reachable
    axios
      .get(imageUrl)
      .then(async () => {
        const filteredImagePath = await filterImageFromURL(imageUrl);
        res.status(200).sendFile(filteredImagePath, (err) => {
          deleteLocalFiles([filteredImagePath]);
        });
      })
      .catch(() => {
        res
          .status(422)
          .send(
            "Failed to GET the required image_url, make sure the provided url is valid"
          );
      });
  });

  //! END @TODO1

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}");
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
