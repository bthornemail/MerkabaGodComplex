
export default function TopicsForm(el, topics, config) {
	const form = document.createElement("form")
	const select = document.createElement("select")
	const input = document.createElement("input")
	form.id = "topics-form"
	form.classList.add("form")
	form.classList.add("input-group")
	select.id = "topics-select"
	select.name = "topics"
	select.classList.add("form-select")
	select.classList.add("form-select-sm")
	topics.forEach((topic) => {
		const option = document.createElement("option");
		option.name = topic
		option.value = topic
		select.append(option)
	})
	input.id = "topics-select"
	input.name = "topic"
	input.classList.add("form-control")
	input.classList.add("form-select-sm")
	button.id = "topics-select"
	button.name = "topics"
	button.type = "submit"
	button.classList.add("btn")
	button.classList.add("btn-primary")
	button.textContent = "Search"
	form.append(select)
	el.apped(form)

	// 	< option name = "Topics" value = "" > <i>🍅🍊🍏</i>Topics</ >
    //   <option name="Connections" value="">Connections</option>
    //   <optgroup label="Services">
    //     <option value="Listings">&#1F34A;Listings</option>
    //     <option value="Service">Service</option>
    //   </optgroup>
    //   <optgroup label="Consumer">
    //     <option value="Customer" path="Customer">Customer</option>
    //     <option value="Order">Order</option>
    //     <option value="Order">Consideration</option>
    //     <option value="Order">Confirmation</option>
    //     <option value="Order">Declaration</option>
    //     <option value="Order">Invoice</option>
    //   </optgroup>
    //   <optgroup label="Provider">
    //     <option value="Customer">Customer</option>
    //     <option value="Customer">Contract</option>
    //     <option value="Customer">Fulfillment</option>
    //     <option value="Customer">Resolution</option>
    //     <option value="Customer">Proposal</option>
    //     <option value="Customer">Agreement</option>
    //   </optgroup>
    // </select >
	return
}