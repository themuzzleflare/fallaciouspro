fetch("https://api.apple-cloudkit.com/database/1/iCloud.cloud.tavitian.fallaciouspro/production/public/records/query?ckAPIToken=c3bf01204e15c98abe27839e3a38d321cf1f944a1b339e68616d745906787e87", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        zoneID: {
            zoneName: "_defaultZone"
        },
        query: {
            sortBy: [{
                fieldName: "name",
                ascending: !0
            }],
            recordType: "Fallacies"
        },
        resultsLimit: 200
    })
}).then(e => e.json()).then(e => showRecords(e.records)),
showRecords = (e => {
    const n = document.querySelector("#records");
    e.forEach(e => {
        const t = document.createElement("div"),
		o = e.fields;
        if (o.hasOwnProperty("name")) {
            const e = document.createElement("p");
            e.innerHTML = `<b>Name</b>: ${o.name.value}`,
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
        t.style.backgroundColor = "silver",
        t.style.border = "thin solid #000000",
        t.style.borderRadius = "20px",
        t.style.margin = "10px",
        t.style.padding = "20px",
        n.append(t)
    })
});