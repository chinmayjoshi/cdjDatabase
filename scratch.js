function fib(n) {
    //memoization 
    //input validation 

    if(n == 1){
        return 1
    }
    if(n == 0) {
        return 0;

    }

    return fib(n-1) + fib(n-2);
}

console.log(fib(5));

