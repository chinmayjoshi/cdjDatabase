function findConnectedComponents(graphInput) {

    var graph = graphInput;
    var nodes = graph.length;
    var visited = new Array(nodes);
    var components = 0;

    for(var i = 0; i < nodes; i++) {
        if(!visited[i]) {
            dfs(i);
            components++;
        }
    }




}

// change the below function to a iterative one


function dfs(node) {
    var stack = [];
    var visited = [];
    stack.push(node);
    while(stack.length > 0) {
        var currNode = stack.pop();
        visited[currNode] = true;
        for(var i = 0; i < nodes; i++) {
            if(graph[currNode][i] && !visited[i]) {
                stack.push(i);
            }
        }
    }
}

/* explain mapReduce and how it works */

// MapReduce is a programming model and an associated implementation for processing and generating big data sets with a parallel, distributed algorithm on a cluster.

function mapReduce() {
    // map
    // reduce
    // shuffle
    // sort
}






