import "cypress-localstorage-commands";
import "../support/commands";

let submissionData = Cypress.env('submissionData');
console.log(submissionData)

/// <reference types="cypress" />

import patchedEmployee from "../fixtures/patchedEmployees.json";
import employeeData from "../fixtures/employees.json";

submissionData.map(({ submission_link: url, id, json_server_link: server_url }) => {
  describe("Test", () => {
    let acc_score = 1;

    it("Able to display Employees", () => {
      cy.intercept("GET", "**/employees", {
        fixture: "employees.json",
      }).as("getEmployees");

      cy.visit(url);
      cy.wait("@getEmployees").then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
        expect(interception.response.body.length).to.eq(5);
      });

      cy.get('[class="card-list"]').children().should("have.length", 5)


      cy.then(() => {
        acc_score += 3;
      });
    });

    it("Able to add new Employee", () => {
      cy.intercept("POST", "**/employees", (req) => {
        req.reply({
          statusCode: 201,
          body: {
            name: "Test",
            department: 4,
            salary: 15555,
            image: "/images/avatar/avatar1.jpeg",
            id: 3,
          },
        });
      }).as("postRequest");
      cy.visit(url);
      let data = {
        name: "Test",
        department: 4,
        salary: 15555,
        image: "/images/avatar/avatar1.jpeg",
      };

      cy.get("#employee-name").type(data.name);
      cy.get("#employee-image").type(data.image);
      cy.get("#employee-dept").type(data.department);
      cy.get("#employee-salary").type(data.salary);
      cy.get("#add-employee").click();
      cy.wait("@postRequest").then((res) => {
       // console.log(res);
      });
      cy.intercept("GET", "**/employees", {
        fixture: "employees-with-new-post.json",
      }).as("getEmployees");
      cy.reload();
      cy.wait("@getEmployees").then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
        expect(interception.response.body.length).to.eq(6);
        expect(interception.response.body).to.deep.include({
          name: "Test",
          department: 4,
          salary: 15555,
          image: "/images/avatar/avatar1.jpeg",
          id: 3,
        });
        cy.get(".card-list").children().should("have.length", 6);

        cy.then(() => {
          acc_score += 3;
        });
      });
    });

    it("able to update all the fields of an employee", () => {
      cy.intercept("PATCH", `**/employees/**`, (req) => {
        req.reply({
          body: patchedEmployee,
        });
      }).as("patchEmployee");
      cy.visit(url);
      cy.wait(1000);
      let patchedData = {
        id: 1,
        name: "Abram Langtry USA",
        image: "/images/avatar/avatar2.jpeg",
        department: 4,
        salary: 1500,
      };
      cy.get(".data-list-wrapper").first(".card-link").click();
      cy.get("#update-employee-name").clear().type(patchedData.name);
      cy.get("#update-employee-image").clear().type(patchedData.image);
      cy.get("#update-employee-dept").clear().type(patchedData.department);
      cy.get("#update-employee-salary").clear().type(patchedData.salary);
      cy.get("#update-employee").click();

      cy.wait("@patchEmployee").then((data) => {
        expect(data.response.statusCode).to.eq(200);
       // console.log(data);
      });

      cy.intercept("GET", "**/employees", {
        fixture: "employees-with-new-post.json",
      }).as("getEmployees");
      cy.reload();
      cy.wait("@getEmployees").then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
        expect(interception.response.body.length).to.eq(6);
        expect(interception.response.body).to.deep.include({
          id: 1,
          name: "Abram Langtry USA",
          image: "/images/avatar/avatar2.jpeg",
          department: 4,
          salary: 1500,
        });
        cy.get(".card-list").children().should("have.length", 6);

        cy.then(() => {
          acc_score += 2;
        });
      });
    });

    it("Able to update only the salary", () => {
      cy.intercept("PATCH", `**/employees/**`, (req) => {
        req.reply({
          body: { id: 2, salary: 123456 },
        });
      }).as("patchSalary");
      cy.visit(url);
      cy.wait(1000);
      let patchedSalary = {
        id: 2,
        salary: 123456,
      };
      cy.get(".data-list-wrapper").first(".card-link").click();

      cy.get("#update-score-employee-salary")
        .clear()
        .type(patchedSalary.salary);
      cy.get("#update-score-employee-id").clear().type(patchedSalary.id);
      cy.get("#update-score-employee").click();

      cy.wait("@patchSalary").then((data) => {
        expect(data.response.statusCode).to.eq(200);
       // console.log(data);
      });

      cy.intercept("GET", "**/employees", {
        fixture: "employees-with-new-post.json",
      }).as("getEmployees");
      cy.reload();
      cy.wait("@getEmployees").then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
        expect(interception.response.body.length).to.eq(6);
        expect(interception.response.body).to.deep.include({
          id: 2,
          name: "Flossy Arrell",
          image: "/images/avatar/avatar1.jpeg",
          department: 2,
          salary: 123456,
        });
        cy.get(".card-list").children().should("have.length", 6);

        cy.then(() => {
          acc_score += 2;
        });
      });
    });

    it("Sorts Low to high as expected", () => {
      cy.visit(url);
      cy.wait(500)
      const Cards = ".data-list-wrapper .card-list .card";

      cy.get("#sort-low-to-high").click();
      cy.wait(500);

      let arr = [];
      cy.get(Cards)
        .each(($el, index, $list) => {
          arr.push(+$el.find(".card-salary").text());
        })
        .then(() => {
         // console.log(arr, arr.length);
          const isSorted = arr.reduce(
            (n, item) => n !== false && item >= n && item
          );
          expect(!!isSorted).to.be.true;
          expect(arr.length).to.be.greaterThan(0);
        });
      cy.then(() => {
        acc_score += 1;
      });
    }); // 1
    it("Sorts High to Low as expected", () => {
      cy.visit(url);
      cy.wait(500)
      const Cards = ".data-list-wrapper .card-list .card";

      cy.get("#sort-high-to-low").click();
      cy.wait(500);

      let arr = [];
      cy.get(Cards)
        .each(($el, index, $list) => {
          arr.push(+$el.find(".card-salary").text());
        })
        .then(() => {
         // console.log(arr, arr.length);
          const isSorted = arr.reduce(
            (n, item) => n !== false && item <= n && item
          );
          expect(!!isSorted).to.be.true;
          expect(arr.length).to.be.greaterThan(0);
        });

      cy.then(() => {
        acc_score += 1;
      });
    }); // 1

    it("Filters of less than 1Lakh as expected", () => {
      cy.visit(url);
      const Cards = ".data-list-wrapper .card-list .card";
      cy.wait(500);
        cy.get("#filter-less-than-1L").click();
        cy.wait(500);
  
        let arr = [];
        cy.get(Cards)
          .each(($el, index, $list) => {
            let currency = $el
              .find(".card-salary").text()
              
            arr.push(Number(currency));
          })
          .then(() => {
            let ans = true;
           // console.log(typeof(arr[0]) ,arr);
            for (let i = 0; i < arr.length; i++) {
              if (arr[i] >= 100000) {
                ans = false;
              }
            }
  
            expect(ans).to.be.true;
            expect(arr.length).to.be.greaterThan(0);
          });
     
      cy.then(() => {
        acc_score += 1;
      });
    }); // 1

    it("Filters of greater than 1Lakh as expected", () => {
      cy.visit(url);
      const Cards = ".data-list-wrapper .card-list .card";
      cy.wait(500);
      cy.get("#filter-more-than-equal-1L").click();
      cy.wait(500);

      let arr = [];
      cy.get(Cards)
        .each(($el, index, $list) => {
          let currency = $el
            .find(".card-salary").text()
            
          arr.push(Number(currency));
        })
        .then(() => {
          let ans = true;
          for (let i = 0; i < arr.length; i++) {
            if (arr[i] < 100000) {
              ans = false;
            }
          }
          expect(ans).to.be.true;
          expect(arr.length).to.be.greaterThan(0);
        });

      cy.then(() => {
        acc_score += 1;
      });
    }); // 1

    it(`generate score`, () => {
      //////////////
      console.log(acc_score);
      let result = {
        id,
        marks: Math.floor(acc_score),
      };
      result = JSON.stringify(result);
      cy.writeFile("results.json", `\n${result},`, { flag: "a+" }, (err) => {
        if (err) {
          console.error(err);
        }
      });
      //////////////////
    });
  }); // describe
});