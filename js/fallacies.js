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
  
  database.performQuery(query, options).then(function(response) {
    if (response.hasErrors) {
      throw response.errors[0];
    } else {
      appendFallacies(response.records);
    };
  });
};

function appendFallacies(records) {
  var recordsDiv = document.querySelector("#records");
  var accordionElement = rootAccordionElement();
  
  records.forEach(record => {
    accordionElement.append(fallacyElement(record));
  });
  
  recordsDiv.append(accordionElement);
};

function rootAccordionElement() {
  var element = document.createElement("ul");
  element.setAttribute("uk-accordion", "");
  return element;
};

function fallacyElement(record) {
  const fields = record.fields;
  
  var accordionListElement = styledAccordionItemElement();
  var contentElement = styledContentElement();
  
  if (fields.hasOwnProperty("name")) {
    contentElement.append(attributeElement("Name", fields.name.value));
  };
  
  if (fields.hasOwnProperty("latinName")) {
    contentElement.append(attributeElement("Latin Name", fields.latinName.value));
  };
  
  if (fields.hasOwnProperty("aliases")) {
    const aliasesDetail = fields.aliases.value.join(", ").italics();
    contentElement.append(attributeElement("Aliases", aliasesDetail));
  };
  
  if (fields.hasOwnProperty("newTerminology")) {
    contentElement.append(listElement("New Terminology", fields.newTerminology.value));
  };
  
  if (fields.hasOwnProperty("logicalForms")) {
    contentElement.append(listElement("Logical Forms", fields.logicalForms.value));
  };
  
  if (fields.hasOwnProperty("description")) {
    contentElement.append(attributeElement("Description", fields.description.value));
  };
  
  if (fields.hasOwnProperty("examples")) {
    contentElement.append(listElement("Examples", fields.examples.value));
  };
  
  if (fields.hasOwnProperty("exceptions")) {
    contentElement.append(listElement("Exceptions", fields.exceptions.value));
  };
  
  if (fields.hasOwnProperty("tip")) {
    contentElement.append(attributeElement("Tip", fields.tip.value));
  };
  
  if (fields.hasOwnProperty("references")) {
    contentElement.append(listElement("References", fields.references.value));
  };
  
  accordionListElement.append(fallacyTitleElement(fields.name.value), contentElement);
  
  return accordionListElement;
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