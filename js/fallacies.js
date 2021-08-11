"use strict";

CloudKit.configure({
  containers: [{
    containerIdentifier: "iCloud.cloud.tavitian.fallaciouspro",
    environment: "production",
    apiTokenAuth: {
      apiToken: "c3bf01204e15c98abe27839e3a38d321cf1f944a1b339e68616d745906787e87"
    }
  }]
});

var container = CloudKit.getDefaultContainer();
var database = container.publicCloudDatabase;

fetchFallacies();

function fetchFallacies() {
  var query = {
    recordType: "Fallacies",
    sortBy: [
      {
        fieldName: "name",
        ascending: true
      }
    ]
  };
  
  var options = {
    resultsLimit: 200
  };
  
  database.performQuery(query, options)
  .then(function(response) {
    if (response.hasErrors) {
      throw response.errors[0];
    } else {
      appendFallacies(response.records);
    };
  });
};

function appendFallacies(records) {
  var recordsDiv = document.getElementById("recordsroot");
  var finalAccordion = document.createElement("div");
  finalAccordion.className = "accordion";
  finalAccordion.setAttribute("id", "records");
  
  records.forEach(record => {
    var accordionElement = document.createElement("div");
    accordionElement.className = "accordion-item";
    const titleElement = fallacyTitleElement(record);
    const contentElement = fallacyElement(record);
    accordionElement.append(titleElement, contentElement);
    finalAccordion.append(accordionElement);
  });
  
  recordsDiv.append(finalAccordion);
};

function fallacyElement(record) {
  const fields = record.fields;
  
  var headingId = "heading" + record.recordName;
  var collapseId = "collapse" + record.recordName;
  
  var divElement = document.createElement("div");
  divElement.className = "accordion-collapse collapse";
  divElement.setAttribute("id", collapseId);
  divElement.setAttribute("aria-labelledby", headingId);
  divElement.setAttribute("data-bs-parent", "#records");
  var bodyDiv = document.createElement("div");
  bodyDiv.className = "accordion-body";
  
  if (fields.hasOwnProperty("name")) {
    const element = attributeElement("Name", fields.name.value);
    bodyDiv.append(element);
  };
  
  if (fields.hasOwnProperty("latinName")) {
    const element = attributeElement("Latin Name", fields.latinName.value);
    bodyDiv.append(element);
  };
  
  if (fields.hasOwnProperty("aliases")) {
    const detail = fields.aliases.value.join(", ").italics();
    const element = attributeElement("Aliases", detail);
    bodyDiv.append(element);
  };
  
  if (fields.hasOwnProperty("newTerminology")) {
    const element = listElement("New Terminology", fields.newTerminology.value);
    bodyDiv.append(element);
  };
  
  if (fields.hasOwnProperty("logicalForms")) {
    const element = listElement("Logical Forms", fields.logicalForms.value);
    bodyDiv.append(element);
  };
  
  if (fields.hasOwnProperty("description")) {
    const element = attributeElement("Description", fields.description.value);
    bodyDiv.append(element);
  };
  
  if (fields.hasOwnProperty("examples")) {
    const element = listElement("Examples", fields.examples.value);
    bodyDiv.append(element);
  };
  
  if (fields.hasOwnProperty("exceptions")) {
    const element = listElement("Exceptions", fields.exceptions.value);
    bodyDiv.append(element);
  };
  
  if (fields.hasOwnProperty("tip")) {
    const element = attributeElement("Tip", fields.tip.value);
    bodyDiv.append(element);
  };
  
  if (fields.hasOwnProperty("references")) {
    const element = listElement("References", fields.references.value);
    bodyDiv.append(element);
  };
  
  divElement.append(bodyDiv);
  return divElement;
};

function fallacyTitleElement(record) {
  var headingId = "heading" + record.recordName;
  var collapseId = "collapse" + record.recordName;
  var headingElement = document.createElement("h2");
  var buttonElement = document.createElement("button");
  headingElement.className = "accordion-header";
  headingElement.setAttribute("id", headingId);
  buttonElement.className = "accordion-button collapsed"
  buttonElement.setAttribute("type", "button");
  buttonElement.setAttribute("data-bs-toggle", "collapse");
  buttonElement.setAttribute("data-bs-target", "#" + collapseId);
  buttonElement.setAttribute("aria-expanded", "false");
  buttonElement.setAttribute("aria-controls", collapseId);
  buttonElement.textContent = record.fields.name.value;
  headingElement.append(buttonElement);
  return headingElement;
};

function attributeElement(title, detail) {
  var element = document.createElement("p");
  element.innerHTML = `<b>${title}</b>: ${detail}`;
  return element;
};

function listElement(title, items) {
  var divElement = document.createElement("div");
  var titleElement = document.createElement("p");
  titleElement.innerHTML = `<b>${title}</b>:`;
  var itemsElement = document.createElement("ul");
  items.forEach(item => {
    var itemElement = document.createElement("li");
    itemElement.innerText = item;
    itemElement.style.marginBottom = "1em";
    itemsElement.append(itemElement);
  });
  divElement.append(titleElement, itemsElement);
  return divElement;
};