CloudKit.configure({
    containers: [{
        containerIdentifier: 'iCloud.cloud.tavitian.fallaciouspro',
        apiTokenAuth: {
            apiToken: 'c3bf01204e15c98abe27839e3a38d321cf1f944a1b339e68616d745906787e87'
        },
        environment: 'production'
    }]
});

var container = CloudKit.getDefaultContainer();
var database = container.publicCloudDatabase;

fetchFallacies()

function fetchFallacies() {
    var query = {
        recordType: 'Fallacies',
        sortBy: [
            {
                fieldName: 'name',
                ascending: true
            }
        ]
    }
    
    var options = {
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
}

function showRecords(records) {
    const recordsDiv = document.querySelector("#records")
    
    const accordionElement = document.createElement("ul")
    accordionElement.setAttribute("uk-accordion", "")
    
    records.forEach(record => {
        const o = record.fields
        
        const accordionListElement = document.createElement("li")
        const titleElement =  document.createElement("a")
        
        titleElement.classList.add("uk-accordion-title")
        titleElement.innerText = o.name.value
        
        const t = document.createElement("div")
        t.classList.add("uk-accordion-content")
        
        if (o.hasOwnProperty("name")) {
            const e = document.createElement("p")
            e.innerHTML = `<b>Name</b>: ${o.name.value}`
            t.append(e)
        }
        
        if (o.hasOwnProperty("latinName")) {
            const e = document.createElement("p");
            e.innerHTML = `<b>Latin Name</b>: ${o.latinName.value}`,
            t.append(e)
        }
        
        if (o.hasOwnProperty("aliases")) {
            const e = o.aliases.value.join(", ").italics(),
            n = document.createElement("p");
            n.innerHTML = `<b>Aliases</b>: ${e}`,
            t.append(n)
        }
        
        if (o.hasOwnProperty("newTerminology")) {
            const e = document.createElement("div"),
            n = document.createElement("p");
            n.innerHTML = "<b>New Terminology</b>:";
            const a = document.createElement("ul");
            o.newTerminology.value.forEach(e => {
                const n = document.createElement("li");
                n.innerText = `${e}`,
                n.style.marginBottom = "1em",
                a.append(n)
            }),
            e.append(n, a),
            t.append(e)
        }
        
        if (o.hasOwnProperty("logicalForms")) {
            const e = document.createElement("div"),
            n = document.createElement("p");
            n.innerHTML = "<b>Logical Forms</b>:";
            const a = document.createElement("ul");
            o.logicalForms.value.forEach(e => {
                const n = document.createElement("li");
                n.innerText = `${e}`,
                n.style.marginBottom = "1em",
                a.append(n)
            }),
            e.append(n, a),
            t.append(e)
        }
        
        if (o.hasOwnProperty("description")) {
            const n = document.createElement("p");
            n.innerHTML = `<b>Description</b>: ${o.description.value}`,
            t.append(n)
        }
        
        if (o.hasOwnProperty("examples")) {
            const e = document.createElement("div"),
            n = document.createElement("p");
            n.innerHTML = "<b>Examples</b>:";
            const a = document.createElement("ul");
            o.examples.value.forEach(e => {
                const n = document.createElement("li");
                n.innerText = `${e}`,
                n.style.marginBottom = "1em",
                a.append(n)
            }),
            e.append(n, a),
            t.append(e)
        }
        
        if (o.hasOwnProperty("exceptions")) {
            const e = document.createElement("div"),
            n = document.createElement("p");
            n.innerHTML = "<b>Exceptions</b>:";
            const a = document.createElement("ul");
            o.exceptions.value.forEach(e => {
                const n = document.createElement("li");
                n.innerText = `${e}`,
                n.style.marginBottom = "1em",
                a.append(n)
            }),
            e.append(n, a),
            t.append(e)
        }
        
        if (o.hasOwnProperty("tip")) {
            const e = document.createElement("p");
            e.innerHTML = `<b>Tip</b>: ${o.tip.value}`,
            t.append(e)
        }
        
        if (o.hasOwnProperty("references")) {
            const e = document.createElement("div"),
            n = document.createElement("p");
            n.innerHTML = "<b>References</b>:";
            const a = document.createElement("ul");
            o.references.value.forEach(e => {
                const n = document.createElement("li");
                n.innerText = `${e}`,
                n.style.marginBottom = "1em",
                a.append(n)
            }),
            e.append(n, a),
            t.append(e)
        }
        
        accordionListElement.style.backgroundColor = "silver"
        accordionListElement.style.border = "thin solid #000000"
        accordionListElement.style.borderRadius = "20px"
        accordionListElement.style.margin = "10px"
        accordionListElement.style.padding = "20px"
        
        accordionListElement.append(titleElement, t)
        accordionElement.append(accordionListElement)
    })
    recordsDiv.append(accordionElement)
};