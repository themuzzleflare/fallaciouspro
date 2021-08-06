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
  var recordsDiv = document.querySelector("#records");
  var accordionElement = styledAccordionElement();
  
  records.forEach(record => {
    const element = fallacyElement(record);
    accordionElement.append(element);
  });
  
  recordsDiv.append(accordionElement);
};

function styledAccordionElement() {
  var element = document.createElement("ul");
  element.setAttribute("uk-accordion", "");
  return element;
};

function fallacyElement(record) {
  const fields = record.fields;
  const titleElement = fallacyTitleElement(fields.name.value);
  var contentElement = styledContentElement();
  var accordionItemElement = styledAccordionItemElement();
  
  if (fields.hasOwnProperty("name")) {
    const element = attributeElement("Name", fields.name.value);
    contentElement.append(element);
  };
  
  if (fields.hasOwnProperty("latinName")) {
    const element = attributeElement("Latin Name", fields.latinName.value);
    contentElement.append(element);
  };
  
  if (fields.hasOwnProperty("aliases")) {
    const detail = fields.aliases.value.join(", ").italics();
    const element = attributeElement("Aliases", detail);
    contentElement.append(element);
  };
  
  if (fields.hasOwnProperty("newTerminology")) {
    const element = listElement("New Terminology", fields.newTerminology.value);
    contentElement.append(element);
  };
  
  if (fields.hasOwnProperty("logicalForms")) {
    const element = listElement("Logical Forms", fields.logicalForms.value);
    contentElement.append(element);
  };
  
  if (fields.hasOwnProperty("description")) {
    const element = attributeElement("Description", fields.description.value);
    contentElement.append(element);
  };
  
  if (fields.hasOwnProperty("examples")) {
    const element = listElement("Examples", fields.examples.value);
    contentElement.append(element);
  };
  
  if (fields.hasOwnProperty("exceptions")) {
    const element = listElement("Exceptions", fields.exceptions.value);
    contentElement.append(element);
  };
  
  if (fields.hasOwnProperty("tip")) {
    const element = attributeElement("Tip", fields.tip.value);
    contentElement.append(element);
  };
  
  if (fields.hasOwnProperty("references")) {
    const element = listElement("References", fields.references.value);
    contentElement.append(element);
  };
  
  accordionItemElement.append(titleElement, contentElement);
  return accordionItemElement;
};

function fallacyTitleElement(title) {
  var element = document.createElement("a");
  element.classList.add("uk-accordion-title");
  element.innerText = title;
  return element;
};

function styledContentElement() {
  var element = document.createElement("div");
  element.classList.add("uk-accordion-content");
  return element;
};

function styledAccordionItemElement() {
  var element = document.createElement("li");
  element.style.backgroundColor = "silver";
  element.style.border = "thin solid #000000";
  element.style.borderRadius = "20px";
  element.style.margin = "10px";
  element.style.padding = "20px";
  return element;
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