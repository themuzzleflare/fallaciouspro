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

pageIsLoading(true);
fetchFallacies();

function fetchFallacies(queryResponse) {
  var query;
  var options;
  
  if (queryResponse) {
    query = queryResponse;
    options = null;
  } else {
    query = {
      recordType: "Fallacies",
      sortBy: [
        {
          fieldName: "name",
          ascending: true
        }
      ]
    };
    options = {
      resultsLimit: 200
    };
  }
  
  database.performQuery(query, options)
  .then(function(response) {
    if (response.hasErrors) {
      throw response.errors[0];
    } else if (response.isQueryResponse) {
      renderFallacies(response.records);
      if (response.moreComing) {
        fetchFallacies(response);
      } else {
        pageIsLoading(false);
      }
    };
  })
  .catch(function(error) {
    pageIsLoading(false);
    if (error.isCKError) {
      newAlert(error.ckErrorCode, error.reason, "danger");
    };
  })
};

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
  headerElement.className = "accordion-header";
  headerElement.setAttribute("id", headingId);
  buttonElement.className = "accordion-button collapsed";
  buttonElement.setAttribute("type", "button");
  buttonElement.setAttribute("data-bs-toggle", "collapse");
  buttonElement.setAttribute("data-bs-target", "#" + collapseId);
  buttonElement.setAttribute("aria-expanded", "false");
  buttonElement.setAttribute("aria-controls", collapseId);
  buttonElement.textContent = record.fields.name.value;
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
  
  if (fields.hasOwnProperty("latinName")) {
    const element = attributeElement("Latin Name", fields.latinName.value);
    bodyElement.append(element);
  };
  
  if (fields.hasOwnProperty("aliases")) {
    const detail = fields.aliases.value.join(", ").italics();
    const element = attributeElement("Aliases", detail);
    bodyElement.append(element);
  };
  
  if (fields.hasOwnProperty("newTerminology")) {
    const element = listElement("New Terminology", fields.newTerminology.value);
    bodyElement.append(element);
  };
  
  if (fields.hasOwnProperty("logicalForms")) {
    const element = listElement("Logical Forms", fields.logicalForms.value);
    bodyElement.append(element);
  };
  
  if (fields.hasOwnProperty("description")) {
    const element = attributeElement("Description", fields.description.value);
    bodyElement.append(element);
  };
  
  if (fields.hasOwnProperty("examples")) {
    const element = listElement("Examples", fields.examples.value);
    bodyElement.append(element);
  };
  
  if (fields.hasOwnProperty("exceptions")) {
    const element = listElement("Exceptions", fields.exceptions.value);
    bodyElement.append(element);
  };
  
  if (fields.hasOwnProperty("tip")) {
    const element = attributeElement("Tip", fields.tip.value);
    bodyElement.append(element);
  };
  
  if (fields.hasOwnProperty("references")) {
    const element = listElement("References", fields.references.value);
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

function listElement(title, items) {
  var divElement = document.createElement("div");
  var titleElement = document.createElement("p");
  var itemsElement = document.createElement("ul");
  items.forEach(item => {
    var itemElement = document.createElement("li");
    itemElement.textContent = item;
    itemsElement.append(itemElement);
  });
  titleElement.innerHTML = "<strong>" + title + "</strong>:";
  divElement.append(titleElement, itemsElement);
  return divElement;
};

function newAlert(heading, message, type) {
  var alertPlaceholder = document.getElementById("alertPlaceholder");
  var alertElement = document.createElement("div");
  var headingElement = document.createElement("h4");
  var messageElement = document.createElement("p");
  var buttonElement = document.createElement("button");
  alertElement.className = "alert alert-" + type + " alert-dismissible";
  alertElement.setAttribute("role", "alert");
  headingElement.className = "alert-heading";
  headingElement.textContent = heading;
  messageElement.textContent = message;
  buttonElement.className = "btn-close";
  buttonElement.setAttribute("type", "button");
  buttonElement.setAttribute("data-bs-dismiss", "alert");
  buttonElement.setAttribute("aria-label", "Close");
  alertElement.append(headingElement, messageElement, buttonElement);
  alertPlaceholder.append(alertElement);
};

function pageIsLoading(bool) {
  var spinnerElement = document.getElementById("spinner");
  if (bool) {
    spinnerElement.removeAttribute("hidden");
  } else {
    spinnerElement.setAttribute("hidden", "");
  };
};