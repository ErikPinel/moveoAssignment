import "./App.css";
import { useEffect, useState } from "react";
import Lesson from "./components/Lesson";

const codeBlocksTitle = ["bubble sort", "fizzbuzz", "how to alert", "Insertion Sort"];
const codeBlocksDescription = [
  "Bubble Sort repeatedly iterates through a list, comparing adjacent elements and swapping them if they are in the wrong order. This process continues until the list is sorted. It is named for the way smaller elements `bubble` to the top with each iteration. While simple to implement, its time complexity of O(n^2) makes it inefficient for large datasets. However, it can perform reasonably well for small lists or nearly sorted data. Understanding Bubble Sort offers insight into fundamental sorting concepts and serves as a foundation for more complex algorithms."
  ,
  "FizzBuzz is a classic programming exercise where numbers from 1 to n are iterated, and for each number, if it's divisible by 3, `Fizz` is printed; if divisible by 5, `Buzz` is printed; if divisible by both 3 and 5, `FizzBuzz` is printed; otherwise, the number itself is printed. This exercise is often used in coding interviews to assess a candidate's basic programming skills and logical thinking. It provides a simple yet effective way to practice conditional statements and loops in programming languages. FizzBuzz serves as a quick test of a programmer's ability to translate simple requirements into code and is a common introductory problem for those learning to code."
  ,
  "Alerts web is a web-based application or feature that provides users with notifications or messages about important events, updates, or reminders. These alerts can vary from notifications about new emails, upcoming appointments, system status changes, or emergency alerts. Alerts web systems are commonly integrated into websites, web applications, or browser extensions to keep users informed and engaged. They utilize various techniques such as push notifications, pop-up alerts, banners, or email notifications to deliver timely information to users. These systems are essential for enhancing user experience, increasing engagement, and ensuring important information reaches users promptly in the digital age."
  ,
  "Insertion Sort is a simple sorting algorithm that iterates through an array, gradually building a sorted section by inserting each element into its proper place. It compares each element with those already sorted, shifting them to make room for the new element. This process continues until the entire array is sorted. While less efficient than some algorithms for large datasets, Insertion Sort performs well for small lists or nearly sorted arrays due to its simplicity and low overhead"
]

const codeBlocksSolution = [
  `
  function bubbleSort(arr) {
    const len = arr.length;
    let swapped;

    do {
        swapped = false;
        for (let i = 0; i < len - 1; i++) {
            if (arr[i] > arr[i + 1]) {
                // Swap elements
                let temp = arr[i];
                arr[i] = arr[i + 1];
                arr[i + 1] = temp;
                swapped = true;
            }
        }
    } while (swapped);

    return arr;
}
  `
  ,

  `
  function fizzBuzz(n) {
    for (let i = 1; i <= n; i++) {
        if (i % 3 === 0 && i % 5 === 0) {
            console.log("FizzBuzz");
        } else if (i % 3 === 0) {
            console.log("Fizz");
        } else if (i % 5 === 0) {
            console.log("Buzz");
        } else {
            console.log(i);
        }
    }
}
`,

  `
function showAlert(message) {
  alert(message);
}


showAlert("This is an alert message!");
`
  ,

  `
function insertionSort(arr) {
  const length = arr.length;
  
  for (let i = 1; i < length; i++) {
      let current = arr[i];
      let j = i - 1;

      // Move elements of arr[0..i-1] that are greater than current
      // to one position ahead of their current position
      while (j >= 0 && arr[j] > current) {
          arr[j + 1] = arr[j];
          j--;
      }
      arr[j + 1] = current;
  }
  
  return arr;
}
`
]

const codeBlocks = [
  {
    title: codeBlocksTitle[0],
    codeDescription: codeBlocksDescription[0],
    codeSolution: codeBlocksSolution[0]
  },
  {
    title: codeBlocksTitle[1],
    codeDescription: codeBlocksDescription[1],
    codeSolution: codeBlocksSolution[1]
  },
  {
    title: codeBlocksTitle[2],
    codeDescription: codeBlocksDescription[2],
    codeSolution: codeBlocksSolution[2]
  },
  {
    title: codeBlocksTitle[3],
    codeDescription: codeBlocksDescription[3],
    codeSolution: codeBlocksSolution[3]
  },
]



let room;

function App() {
  //Room State
  // const [room, setRoom] = useState("");

  // Messages States


  const [currentLesson, setCurentLesson] = useState("");






  useEffect(()=>{
    console.log("first render!!!!")
  },[])

  return (
    <div className="App">
      {!currentLesson ? (
        <div id="mainPageContainer">
          <h1>Choose Code Block :D</h1>
          <div className="codeBlockContainer">
            {codeBlocks.map((e) => (
              <div className="codeBlockItem" onClick={() => setCurentLesson(e.title)}>
                {e.title}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div id="lessonContainer">
          {currentLesson == codeBlocksTitle[0] ? (
            <Lesson
              title={codeBlocks[0].title}
              codeDescription={codeBlocks[0].codeDescription}
              codeSolution={codeBlocks[0].codeSolution}
              setCurentLesson={setCurentLesson}
            />
          ) : currentLesson == codeBlocksTitle[1] ? (
            <Lesson
              title={codeBlocks[1].title}
              codeDescription={codeBlocks[1].codeDescription}
              codeSolution={codeBlocks[1].codeSolution}
              setCurentLesson={setCurentLesson}
            />
          ) : currentLesson == codeBlocksTitle[2] ? (
            <Lesson
              title={codeBlocks[2].title}
              codeDescription={codeBlocks[2].codeDescription}
              codeSolution={codeBlocks[2].codeSolution}
              setCurentLesson={setCurentLesson}
            />
          ) : (
            <Lesson
              title={codeBlocks[3].title}
              codeDescription={codeBlocks[3].codeDescription}
              codeSolution={codeBlocks[3].codeSolution}
              setCurentLesson={setCurentLesson}
              
            />
          )}
        </div>
      )}
    </div>
  );
}

export default App;
