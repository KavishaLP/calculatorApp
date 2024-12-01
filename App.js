import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, SafeAreaView } from 'react-native';

export default function App() {
    const [displayValue, setDisplayValue] = useState('0');  //Holds the value currently displayed on the screen.
    const [isDecimal, setIsDecimal] = useState(false);   //Tracks whether a decimal point has been used.
    const [firstOperand, setFirstOperand] = useState(null);  //Stores the first operand for an operation.
    const [operator, setOperator] = useState(null);   //Stores the current operator (+, -).
    const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);   //if the app is waiting for the second operand after an operator is pressed.

    function handleInput(input) {
        if (isResult) { // Reset calculation when new input is pressed after result
            setDisplayValue(input.toString());
            setIsResult(false);
            setFirstOperand(null);
            setOperator(null);
            setWaitingForSecondOperand(false);
            setIsDecimal(false);
            return;
        }
         if (input === '.' && isDecimal) return;
        if (input === '.') setIsDecimal(true);

        if (displayValue === '0' || waitingForSecondOperand) {
            setDisplayValue(input.toString());
            setWaitingForSecondOperand(false);
        } else {
            setDisplayValue(displayValue + input);
        }
    }

    const handleOperator = (nextOperator) => {    //Manages the flow of operations when an operator button is pressed.
        const inputValue = parseFloat(displayValue);

        if (operator && waitingForSecondOperand) {
            setOperator(nextOperator);
            return;
        }

        if (firstOperand == null) {
            setFirstOperand(inputValue);
        } else if (operator) {
            const result = performCalculation(operator, firstOperand, inputValue);
            setDisplayValue(result.toString());
            setFirstOperand(result);
        }

        setOperator(nextOperator);
        setWaitingForSecondOperand(true);
        setIsDecimal(false);
    };

    const handleOperator = (nextOperator) => {    
        const inputValue = parseFloat(displayValue);

        if (operator && waitingForSecondOperand) {
            setOperator(nextOperator);
            return;
        }

        if (firstOperand == null) {
            setFirstOperand(inputValue);
        } else if (operator) {
            const result = performCalculation(operator, firstOperand, inputValue);
            setDisplayValue(result.toString());
            setFirstOperand(result);
            setIsResult(true); // Mark the result as shown
        }

        setOperator(nextOperator);
        setWaitingForSecondOperand(true);
        setIsDecimal(false);
    };

    const performCalculation = (operator, firstOperand, secondOperand) => {
        switch (operator) {
            case '+':
                return firstOperand + secondOperand;
            case '-':
                return firstOperand - secondOperand;
            case '×':
                return firstOperand * secondOperand;
            case '÷':
                return secondOperand === 0 ? 'Error' : firstOperand / secondOperand;
            case '%':
                return firstOperand * 0.01;
            case '√':
                return firstOperand >= 0 ? Math.sqrt(firstOperand) : 'Error';
            default:
                return secondOperand;
        }
    };

    const handleEqual = () => {
        if (!operator || firstOperand == null) return;

        const secondOperand = parseFloat(displayValue);
        const result = performCalculation(operator, firstOperand, secondOperand);

        setDisplayValue(result.toString());
        setFirstOperand(null);
        setOperator(null);
        setWaitingForSecondOperand(false);
        setIsResult(true); // Mark the result as shown
    };

    const handleClear = () => {     
        setDisplayValue('0');
        setFirstOperand(null);
        setOperator(null);
        setWaitingForSecondOperand(false);
        setIsDecimal(false);
        setIsResult(false); // Reset the result state
    };

    const handleDelete = () => {      
        if (displayValue.length === 1 || displayValue === 'Error') {
            setDisplayValue('0');
            setIsDecimal(false);
        } else {
            setDisplayValue(displayValue.slice(0, -1));
        }
    };
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.displayContainer}>
                {/* Secondary display to show calculation progress */}
                <Text style={styles.secondaryDisplayText}>
                    {firstOperand !== null ? firstOperand : ''} {operator !== null ? operator : ''}{' '}
                    {waitingForSecondOperand ? '' : displayValue}
                </Text>
                <Text style={styles.displayText}>{displayValue}</Text>
            </View>
            <View style={styles.buttonContainer}>
                <View style={styles.row}>
                    <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
                        <Text style={styles.clearButtonText}>C</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                        <Text style={styles.deleteButtonText}>dlt</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.operatorButton]} onPress={() => handleOperator('√')}>
                        <Text style={[styles.buttonText, styles.operatorButtonText]}>√</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.operatorButton]} onPress={() => handleOperator('+')}>
                        <Text style={[styles.buttonText, styles.operatorButtonText]}>+</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.row}>
                    {['7', '8', '9'].map((num) => (
                        <TouchableOpacity key={num} style={styles.button} onPress={() => handleInput(num)}>
                            <Text style={styles.buttonText}>{num}</Text>
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity style={[styles.button, styles.operatorButton]} onPress={() => handleOperator('-')}>
                        <Text style={[styles.buttonText, styles.operatorButtonText]}>-</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.row}>
                    {['4', '5', '6'].map((num) => (
                        <TouchableOpacity key={num} style={styles.button} onPress={() => handleInput(num)}>
                            <Text style={styles.buttonText}>{num}</Text>
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity style={[styles.button, styles.operatorButton]} onPress={() => handleOperator('×')}>
                        <Text style={[styles.buttonText, styles.operatorButtonText]}>×</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.row}>
                    {['1', '2', '3'].map((num) => (
                        <TouchableOpacity key={num} style={styles.button} onPress={() => handleInput(num)}>
                            <Text style={styles.buttonText}>{num}</Text>
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity style={[styles.button, styles.operatorButton]} onPress={() => handleOperator('÷')}>
                        <Text style={[styles.buttonText, styles.operatorButtonText]}>÷</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.row}>
                    <TouchableOpacity style={styles.button} onPress={() => handleInput('0')}>
                        <Text style={styles.buttonText}>0</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => handleInput('.')}>
                        <Text style={styles.buttonText}>.</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.operatorButton]} onPress={() => handleOperator('%')}>
                        <Text style={[styles.buttonText, styles.operatorButtonText]}>%</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.equalButton} onPress={handleEqual}>
                        <Text style={styles.equalButtonText}>=</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

// Screen dimensions-ensure the app adapts to different screen sizes
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
    },
    displayContainer: {
        flex: 2,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        padding: screenWidth * 0.05,
    },
    secondaryDisplayText: {
        fontSize: screenWidth * 0.05,
        color: '#888',
        marginBottom: 5,
    },
    displayText: {
        fontSize: screenWidth * 0.12,
        color: '#fff',
    },
    buttonContainer: {
        flex: 3.5,
        width: '90%',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: screenHeight * 0.01,
    },
    button: {
        flex: 1,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#444',
        margin: screenWidth * 0.01,
        padding: screenWidth * 0.05,
    },
    buttonText: {
        fontSize: screenWidth * 0.08,
        color: '#fff',
    },
    operatorButton: {
        backgroundColor: '#555',
    },
    operatorButtonText: {
        color: '#ff9500',
    },
    equalButton: {
        flex: 2,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ff9500',
        margin: screenWidth * 0.01,
    },
    equalButtonText: {
        fontSize: screenWidth * 0.08,
        color: '#fff',
    },
    clearButton: {
        flex: 2,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ff9500',
        margin: screenWidth * 0.01,
    },
    clearButtonText: {
        fontSize: screenWidth * 0.08,
        color: '#fff',
    },
    deleteButton: {
        flex: 2,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ff9500',
        margin: screenWidth * 0.01,
    },
    deleteButtonText: {
        fontSize: screenWidth * 0.08,
        color: '#fff',
    },
});
