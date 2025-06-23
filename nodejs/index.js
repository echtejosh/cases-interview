import express, {json} from 'express';
import {post} from 'axios';

const app = express();
app.use(json());

// TODO: Reject the request if the name contains repeated adjacent characters.
// Example: "Anna" is OK, but "Aanna" or "Aabb" should be rejected.
function hasRepeatedAdjacentCharacters(str) {

    // runs at O(n) because it runs once per character
    // so the size equals to the time linearly
    // check through each pair in a string if they match, if no match is found
    // then return false, if a match has been found, then it's true
    for (let i = 1; i < str.length; i++) {

        // check whether the characters that are adjacent are the same
        // checking from current index to the next assumed one
        if (str[i] === str[i - 1]) {
            return true;
        }
    }

    return false;
}

app.post('/process', async (req, res) => {
    const {name, email} = req.body;

    // Add your validation logic here 👇
    if (hasRepeatedAdjacentCharacters(name)) {
      return res.status(400).json({ error: 'Name contains invalid repeated characters' });
    }

    const user = await fakeDbCall(name, email);

    try {
        const response = await post('https://mocked-api.com/endpoint', user);
        const {data} = response;
        res.json(data);
    } catch (err) {
        res.status(500).json({error: 'Failed to process user data'});
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));

// Mock database function
function fakeDbCall(name, email) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({id: 1, name, email});
        }, 100);
    });
}
