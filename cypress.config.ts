import { defineConfig } from "cypress";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on("after:spec", (spec, results) => {
        fs.writeFileSync(
          "after_spec_results.json",
          JSON.stringify(results.tests)
        );
      });

      on("task", {
        readFileMaybe(filename) {
          if (fs.existsSync(filename)) {
            return fs.readFileSync(filename, "utf8");
          }

          return null;
        },
      });
    },
  },
  env: {
    serverUrl: `http://127.0.0.1:${process.env.REACT_APP_JSON_SERVER_PORT}`,
    submissionData: readFileMaybe("submissionData.json"),
  },
});

function readFileMaybe(filename) {
  if (fs.existsSync(filename)) {
    let jsonFile = fs.readFileSync(filename, "utf8");
    return JSON.parse(jsonFile);
  }

  return [
    {
      submission_link: "http://localhost:8080",
      id: 67890,
      json_server_link: `http://127.0.0.1:9090/`,
    },
  ];
}
