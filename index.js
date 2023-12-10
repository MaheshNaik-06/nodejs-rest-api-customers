const app = require('express')();
require('dotenv').config();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

// Sample customer data
const customers = [
    { "id": 1, "first_name": "Aarav", "last_name": "Patel", "city": "Mumbai", "company": "TechSolutions" },
    { "id": 2, "first_name": "Aditi", "last_name": "Sharma", "city": "Delhi", "company": "InnovateIndia" },
    { "id": 3, "first_name": "Vikram", "last_name": "Singh", "city": "Jaipur", "company": "DigitalCrafters" },
    { "id": 4, "first_name": "Ananya", "last_name": "Verma", "city": "Bangalore", "company": "DataGenius" },
    { "id": 5, "first_name": "Rahul", "last_name": "Nair", "city": "Chennai", "company": "FutureTech" }
  ];

// API to get list of customers with search and pagination
// Postman request query - localhost:3000/api/customers?city=Jaipur&page=1&pageSize=3
app.get('/api/customers', (req, res) => {
  const { first_name, last_name, city, page, pageSize } = req.query;

  let filteredCustomers = customers;

  if (first_name) {
    filteredCustomers = filteredCustomers.filter(customer => customer.first_name.includes(first_name));
  }

  if (last_name) {
    filteredCustomers = filteredCustomers.filter(customer => customer.last_name.includes(last_name));
  }

  if (city) {
    filteredCustomers = filteredCustomers.filter(customer => customer.city.includes(city));
  }

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + parseInt(pageSize);

  const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);

  res.json({ customers: paginatedCustomers });
});

// API to get a single customer by id
//Postman request query - localhost:3000/api/customers/1
app.get('/api/customers/:id', (req, res) => {
  const customerId = parseInt(req.params.id);
  const customer = customers.find(c => c.id === customerId);

  if (customer) {
    res.json({ customer });
  } else {
    res.status(404).json({ message: 'Customer not found' });
  }
});

// API to get unique cities with the number of customers
//Postman request query - localhost:3000/api/cities
app.get('/api/cities', (req, res) => {
  const cityCounts = {};

  customers.forEach(customer => {
    const city = customer.city;
    cityCounts[city] = (cityCounts[city] || 0) + 1;
  });

  res.json({ cityCounts });
});

// API to add a customer with validations
//Postman request query - localhost:3000/api/customers

app.post('/api/customers', (req, res) => {
  const { id, first_name, last_name, city, company } = req.body;

  // Validate required fields.
  if (!id || !first_name || !last_name || !city || !company) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Validate if city and company already exist
  const existingCustomer = customers.find(c => c.city === city && c.company === company);
  if (!existingCustomer) {
    return res.status(400).json({ message: 'City or company does not exist for an existing customer' });
  }

  // Add the new customer
  const newCustomer = { id, first_name, last_name, city, company };
  customers.push(newCustomer);

  res.json({ customer: newCustomer });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
