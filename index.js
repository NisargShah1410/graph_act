import fetch from "node-fetch";
import fs from "fs";
import core from "actions";
import github from "actions";
//const core = require('@actions/core');
//const github = require('@actions/github');

try {

    const openSource = {
        githubConvertedToken: "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",
        githubUserName: "NisargShah1410",
      };
      
      const query_pr = {
        query: `
          query {
            user(login: "${openSource.githubUserName}"){
              pullRequests(last: 100, orderBy: {field: CREATED_AT, direction: DESC}){
            totalCount
            nodes{
              id
              title
              url
              state
                mergedBy {
                    avatarUrl
                    url
                    login
                }
                createdAt
                number
              changedFiles
                additions
                deletions
              baseRepository {
                    name
                    url
                    owner {
                      avatarUrl
                      login
                      url
                    }
                  }
            }
          }
          }
      }
          `,
      };
      
      const baseUrl = "https://api.github.com/graphql";
    
      const headers = {
        "Content-Type": "application/json",
        Authorization: "bearer " + openSource.githubConvertedToken,
      };
    
    
      fetch(baseUrl, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(query_pr),
      })
        .then((response) => response.text())
        .then((txt) => {
          const data = JSON.parse(txt);
          var cropped = { data: [] };
          cropped["data"] = data["data"]["user"]["pullRequests"]["nodes"];
      
          var open = 0;
          var closed = 0;
          var merged = 0;
          for (var i = 0; i < cropped["data"].length; i++) {
            if (cropped["data"][i]["state"] === "OPEN") open++;
            else if (cropped["data"][i]["state"] === "MERGED") merged++;
            else closed++;
          }
      
          cropped["open"] = open;
          cropped["closed"] = closed;
          cropped["merged"] = merged;
          cropped["totalCount"] = cropped["data"].length;
      
          console.log("Fetching the Pull Request Data.\n");
          fs.writeFile(
            "./pull_requests.json",
            JSON.stringify(cropped),
            function (err) {
              if (err) {
                console.log(err);
              }
            }
          );
        })
        .catch((error) => console.log(JSON.stringify(error)));


} catch (error) {
  core.setFailed(error.message);
}