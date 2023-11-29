# JS-VITE-WITH-MOCK-SERVER

Please do NOT use VSCode live-server. It will not work. Use the npm commands suggested to you here.

## Installation
```
npm install --engine-strict
```

## Start only Backend server
```
npm run server
```

## Start only Frontend server
```
npm run start
```

## Start both BE & FE in a single command
```
npm run watch
```

# Important files
```
.
├── index.html
├── scripts
│   └── main.js
└── styles
    └── style.css
```

## Maximum Marks - 15

- The Submission should not contain spaces, for example /rct-101 folder/eval will not work
- Do not push node_modules and package_lock.json to GitHub
- Use node version(LTS) should be `v16.16.0`
- Don't change/override package.json

## Rubrics
```
✅ able to submit the app - 1 mark ( minimum score )
✅ Display list of employees on page load - 3 marks 
✅ Ability to add new Employee - 3 marks
✅ Ability to update all the fields of an employee - 2 marks
✅ Ability to update only the salary - 2 marks
✅ Ability to sort Low to high data - 1 mark
✅ Ability to sort high to low data - 1 mark
✅ Ability to filters of less than 1Lakh -1 mark
✅ Ability to filters greater than 1Lakh -1 mark
```
### You haven't been taught cypress to run the test cases locally, you can see the passed/ failed test cases and test errors on CP itself.

## Some Rules to follow:-
- Use node version(LTS) should be `v16.16.0`
- Don't change/override package.json
- Before writing a single line of code please read the problem statement very carefully.
- Don't change the already given ids or classes.
- If you don't follow these rules, you might not get any marks even if you do everything correctly.
# Problem statements
### Problem 1. Display list of employees on page load [3]

fetch url: `/employees`
On page ```load```, a list all ```employees``` should be shown in ```div#data-list-wrapper```.

UI: 

![front page](https://user-images.githubusercontent.com/101581634/224396111-b27f7935-cad3-4573-aaa6-5f3d12fa1214.png)

Markup:
- elements, classes & IDs should be identical to the below screenshot.
- The data should be fetched , make a 'GET' request at ```${baseServerURL}/employees```
- The employees should be shown on page ```load```

![front page mark up](https://user-images.githubusercontent.com/101581634/224468737-3abfb839-f899-4b31-89d2-de0e4aeaf7fc.png)


### Problem 2. Ability to add new Employee [3]
![add employee](https://user-images.githubusercontent.com/101581634/224396075-562c3ace-ea67-4bb6-9afb-f929396ea12a.png)

- make a 'POST' request at ```${baseServerURL}/employees```
the page must not reload
the list must update

### Problem 3. Ability to update all the fields of an employee [2]

- Able to populate following input on edit link click.
- add a event listener with ```click``` to anchor tag with class `.card-link` use preventDefault.
- The page should not re-load on the click of the EDIT link `.card-link`.

1. To updated all fields 

- `#update-employee-id`  should be populated with the `id` of the employee 
- `#update-employee-name` should be populated with the `name` of the employee
- `#update-employee-image` should be populated with the `image URL` of the employee
- `#update-employee-dept` should be populated with the `department` of the employee
- `#update-employee-salary` should be populated with the `salary` of the employee

![edit ](https://user-images.githubusercontent.com/101581634/224396082-394508b3-ee94-4fae-a0ea-23d48ad5c005.png)

- make a 'PATCH' request at ```${baseServerURL}/employees/${empId}``` to updated name , image ,dept and salary
- page must not reload
- the list must update

### Problem 4. Ability to update only the salary [2]

- Able to populate following input on edit link click.
- `#update-score-employee-id` should be populated with the `id` of the employee
- `#update-score-employee-salary` should be populated with the `price` of the employee

- Once the edit inputs are populated, if the user clicks `#update-score-employee`. 
- the salary of that particular employee should update based on the value entered in the `#update-score-employee-salary`. 
- The salary of the employee in the list should update without any page reloads.

- make a 'PATCH' request at ```${baseServerURL}/employees/${empId}```

### Problem 5. Ability to sort data by salary [2]

![sorting ](https://user-images.githubusercontent.com/101581634/224398576-6a1f64d6-caac-418c-ba2b-a4acc53a3e21.png)
- On click of the button ```#sort-low-to-high```, the employee list should be sorted in ascending order based on their salary. 
- On click of the button ```#sort-high-to-low```, the employee list should be sorted in descending order based on their salary.
- You may use any approach of your choice for sorting. You may sort the available data or you may make a new fetch request to the server and update the list. In case you want to fetch data, please use the [JSON Server documentation](https://github.com/typicode/json-server).
- page must not reload
- the list must update

### Problem 6. Ability to filter data by salary [2]

![filtering](https://user-images.githubusercontent.com/101581634/224398554-e0581a8f-1496-4d12-bd36-0f1983a2f63c.png)
- When the button `#filter-less-than-1L` is clicked, the employee list is expected to be filtered. It should only show the employees whose `salary` is less than 1Lakh.
- When the button `#filter-more-than-equal-1L` is clicked, the employee list is expected to be filtered. It should only show the employees whose `salary` is more than or equal to 1Lakh.
- You may use any approach of your choice for sorting. You may sort the available data or you may make a new fetch request to the server and update the list. In case you want to fetch data, please use the [JSON Server documentation](https://github.com/typicode/json-server).
- page must not reload
- the list must update
### General guidelines
- The system on cp.masaischool.com may take between 1-20 minutes for responding,
- so we request you to read the problem carefully and debug it before itself
- we also request you not just submit it last minute
- try to keep one submission at a time
- Use `${baseServerURL}/what-ever-route` for server url & not `localhost:9090/what-ever-route` in your solution. Failing to do so may cause all the tests to fail.
- If you try to use VSCodes live server, it won’t work. Use the npm commands provided in this file only.


