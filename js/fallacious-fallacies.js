"use strict";

CloudKit.configure({
  containers: [{
    containerIdentifier: "iCloud.cloud.tavitian.fallacious",
    apiTokenAuth: {
      apiToken: "0efa83e61396cb57ec2882998bb8c72fda8ebc1a4b6742bb252b300429b90b1f"
    },
    environment: "production"
  }]
});

var container = CloudKit.getDefaultContainer();
var database = container.publicCloudDatabase;

fetchFallacies();

function fetchFallacies() {
  var query = {
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
        fieldName: "category",
        comparator: "EQUALS",
        fieldValue: {
          value: {
            recordName: "logical-fallacy",
            action: "NONE"
          },
          type: "REFERENCE"
        }
      }
    ]
  }
  
  var options = {
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
      renderFallacies(response.records);
    }
  })
}

function renderFallacies(records) {
  var recordsElement = document.getElementById("records");
  records.forEach(record => {
    const headerElement = fallacyHeaderElement(record);
    const contentElement = fallacyContentElement(record);
    var itemElement = document.createElement("div");
    itemElement.className = "accordion-item";
    itemElement.append(headerElement, contentElement);
    recordsElement.append(itemElement);
  });
};

function fallacyHeaderElement(record) {
  const headingId = "heading" + record.recordName;
  const collapseId = "collapse" + record.recordName;
  var headerElement = document.createElement("h2");
  var buttonElement = document.createElement("button");
  var imageElement = document.createElement("img");
  var nameElement = document.createElement("p");
  var stackElement = document.createElement("div");
  stackElement.className = "hstack gap-3";
  imageElement.src = record.fields.image.value.downloadURL;
  imageElement.width = "50";
  imageElement.height = "50";
  nameElement.innerText = record.fields.name.value;
  headerElement.className = "accordion-header";
  headerElement.setAttribute("id", headingId);
  buttonElement.className = "accordion-button collapsed";
  buttonElement.setAttribute("type", "button");
  buttonElement.setAttribute("data-bs-toggle", "collapse");
  buttonElement.setAttribute("data-bs-target", "#" + collapseId);
  buttonElement.setAttribute("aria-expanded", "false");
  buttonElement.setAttribute("aria-controls", collapseId);
  stackElement.append(imageElement, nameElement);
  buttonElement.append(stackElement);
  headerElement.append(buttonElement);
  return headerElement;
};

function fallacyContentElement(record) {
  const fields = record.fields;
  const headingId = "heading" + record.recordName;
  const collapseId = "collapse" + record.recordName;
  var collapseElement = document.createElement("div");
  var bodyElement = document.createElement("div");
  collapseElement.className = "accordion-collapse collapse";
  collapseElement.setAttribute("id", collapseId);
  collapseElement.setAttribute("aria-labelledby", headingId);
  collapseElement.setAttribute("data-bs-parent", "#records");
  bodyElement.className = "accordion-body";
  
  if (fields.hasOwnProperty("name")) {
    const element = attributeElement("Name", fields.name.value);
    bodyElement.append(element);
  };
  
  if (fields.hasOwnProperty("categoryName")) {
    const element = attributeElement("Category", fields.categoryName.value);
    bodyElement.append(element);
  };
  
  if (fields.hasOwnProperty("shortDescription")) {
    const element = attributeElement("Short Description", fields.shortDescription.value);
    bodyElement.append(element);
  };
  
  if (fields.hasOwnProperty("longDescription")) {
    const element = attributeElement("Long Description", fields.longDescription.value);
    bodyElement.append(element);
  };
  
  if (fields.hasOwnProperty("example")) {
    const element = attributeElement("Example", fields.example.value);
    bodyElement.append(element);
  };
  
  collapseElement.append(bodyElement);
  return collapseElement;
};

function attributeElement(title, detail) {
  var element = document.createElement("p");
  element.innerHTML = "<strong>" + title + "</strong>: " + detail;
  return element;
};