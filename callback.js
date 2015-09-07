// Simulate some slow I/O task
function blockingIO(callback) {
	// Delay of 3 seconds
	setTimeout(function() {
		callback("The blocking task has been completed");
	}, 3000);
}
 
// A demo callback function
function doThisWhenFinished(message) {
	// All it does it console logs the messgae
	console.log(message);
}
 
// Calling our simulated I/O function
blockingIO(doThisWhenFinished);
 
// The event loop continues 
console.log("Prints before the IO tasks finishes");
