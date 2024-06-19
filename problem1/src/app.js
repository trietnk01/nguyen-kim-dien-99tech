var sum_to_n_a = function (n) {
	let data = [];
	for (var i = 1; i <= n; i++) {
		data.push(i);
	}
	var sum = data.reduce((total, val) => {
		return total + val;
	});
	return sum;
};
var sum_to_n_b = function (n) {
	let sum = 0;
	for (var i = 1; i <= n; i++) {
		sum += i;
	}
	return sum;
};
const resultA = sum_to_n_a(5);
const resultB = sum_to_n_b(5);
console.log("resultA = ", resultA);
console.log("resultB = ", resultB);
