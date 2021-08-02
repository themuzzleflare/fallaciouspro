CloudKit.configure({
  containers: [{
    containerIdentifier: "iCloud.cloud.tavitian.fallacious",
    apiTokenAuth: {
      apiToken: "0efa83e61396cb57ec2882998bb8c72fda8ebc1a4b6742bb252b300429b90b1f"
    },
    environment: "production"
  }]
});

let container = CloudKit.getDefaultContainer();
let database = container.publicCloudDatabase;

fetchBiases();

function fetchBiases() {
  let query = {
    recordType: "itemData",
    sortBy: [
      {
        fieldName: "id",
        ascending: true
      },
      {
        fieldName: "number",
        ascending: true
      }
    ],
    filterBy: [
      {
        comparator: "EQUALS",
        fieldName: "category",
        fieldValue: {
          value: {
            recordName: "cognitive-bias",
            action: "NONE"
          },
          type: "REFERENCE"
        }
      }
    ]
  }
  
  let options = {
    desiredKeys: [
      "id",
      "number",
      "name",
      "categoryName",
      "shortDescription",
      "longDescription",
      "example",
      "image",
      "isFeatured"
    ],
    resultsLimit: 200
  }
  
  database.performQuery(query, options)
  .then(function(response) {
    if (response.hasErrors) {
      throw response.errors[0];
    } else {
      showRecords(response.records);
    }
  });
};

function showRecords(records) {
  const recordsDiv = document.querySelector("#fallacious-biases");
  
  const accordionElement = document.createElement("ul")
  accordionElement.setAttribute("uk-accordion", "")
  
  records.forEach(record => {
    const field = record.fields
    
    const accordionListElement = document.createElement("li")
    const titleElement =  document.createElement("a")
    
    titleElement.classList.add("uk-accordion-title")
    titleElement.innerText = field.name.value
    
    const recordElement = document.createElement("div");
    recordElement.classList.add("uk-accordion-content")
    
    if (field.hasOwnProperty("image")) {
      const imageElement = document.createElement("img");
      
      imageElement.src = `${field.image.value.downloadURL}`;
      imageElement.width = "100";
      imageElement.height = "100";
      
      recordElement.append(imageElement)
    }
    
    if (field.hasOwnProperty("name")) {
      const nameElement = document.createElement("p");
      
      nameElement.innerHTML = `<b>Name</b>: ${field.name.value}`;
      
      recordElement.append(nameElement)
    }
    
    if (field.hasOwnProperty("categoryName")) {
      const categoryNameElement = document.createElement("p");
      
      categoryNameElement.innerHTML = `<b>Category</b>: ${field.categoryName.value}`;
      
      recordElement.append(categoryNameElement)
    }
    
    if (field.hasOwnProperty("shortDescription")) {
      const shortDescriptionElement = document.createElement("p");
      
      shortDescriptionElement.innerHTML = `<b>Short Description</b>: ${field.shortDescription.value}`;
      
      recordElement.append(shortDescriptionElement)
    }
    
    if (field.hasOwnProperty("longDescription")) {
      const longDescriptionElement = document.createElement("p");
      
      longDescriptionElement.innerHTML = `<b>Long Description</b>: ${field.longDescription.value}`;
      
      recordElement.append(longDescriptionElement)
    }
    
    if (field.hasOwnProperty("example")) {
      const solutionElement = document.createElement("p");
      
      solutionElement.innerHTML = `<b>Solution</b>: ${field.example.value}`;
      
      recordElement.append(solutionElement)
    }
    
    accordionListElement.style.backgroundColor = "silver"
    accordionListElement.style.border = "thin solid #000000"
    accordionListElement.style.borderRadius = "20px"
    accordionListElement.style.margin = "10px"
    accordionListElement.style.padding = "20px"
    
    accordionListElement.append(titleElement, recordElement)
    accordionElement.append(accordionListElement)
  });
  recordsDiv.append(accordionElement);
};