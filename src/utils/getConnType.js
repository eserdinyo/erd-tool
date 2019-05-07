const getConnType = (connections) => {
    if(connections[0].dashType == "0 5 5" && connections[1].dashType == "0 5 5")
        return 10;
    else if(connections[0].dashType == "150 5 0" && connections[1].dashType == "150 5 0")
        return 11;
    else if(connections[0].dashType == "0 5 5" && connections[1].dashType == "150 5 0")
        return 12;    
}

export default getConnType;