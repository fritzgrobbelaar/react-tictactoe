def CountConsecutiveOnesAlternative(n):
    #print(n)
    #print(bin(n))
    stringBin = str(bin(n))
    stringBin = stringBin[2:]
    print(n,stringBin)
    longestOnes = 0
    currentOnes = 0
    for value in stringBin:
        if value == '0':
            if currentOnes > longestOnes:
                longestOnes = currentOnes
                currentOnes = 0
        else:
            currentOnes = currentOnes + 1
    if currentOnes > longestOnes:
        longestOnes = currentOnes

    return longestOnes


def CountConsecutiveOnes(n):
    longestOnes = 0
    currentWinners = 0

    while n != 0:
        if n%2 == 1:
            currentWinners = currentWinners+1
            
        else:
            currentWinners = 0
        if currentWinners > longestOnes:
            longestOnes = currentWinners
        n = n//2
    print('returning from option 2:',n,longestOnes)
    return longestOnes


testCases = []
testCases.append([0,0])
testCases.append([5,1])
testCases.append([15,4])
testCases.append([30,4])

for testCase in testCases:
    print('testCase:',testCase)
    #print("Results:",CountConsecutiveOnes(testCase[0]))
    assert testCase[1] == CountConsecutiveOnes(testCase[0])