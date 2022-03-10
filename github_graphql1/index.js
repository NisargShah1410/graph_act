import fetch from "node-fetch";
import fs from "fs";

const openSource = {
    githubConvertedToken: "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",
    githubUserName: "NisargShah1410",
  };
  
  const query_commit = {
    query: `
      query {
        user(login: "NisargShah1410"){
          repository(name: "git_com"){
            ref(qualifiedName: "main"){
              target{
                ... on Commit{
                  history(first: 10){
                    edges{
                      node{
                        author{
                          name
                        }
                        message
                      }
                    }
                  }
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
    body: JSON.stringify(query_commit),
  })
    .then((response) => response.text())
    .then((txt) => {
      const data = JSON.parse(txt);
      const orgs = data["data"]["user"]["repository"]["nodes"];
      var newOrgs = { data: [] };
  
      for (var i = 0; i < orgs.length; i++) {
        var obj = orgs[i]["author"];
        newOrgs["data"].push(obj);
       }

      console.log("Fetching the Commit history Data.\n");
      console.log(JSON.stringify(newOrgs));
    })
    .catch((error) => console.log(JSON.stringify(error)));