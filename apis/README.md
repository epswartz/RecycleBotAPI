# apis

Each api file returns an object with two properties:

```
{
	path: '/example', // Path to mount on
	app: [Object] // An express app with the routes on it
}
```