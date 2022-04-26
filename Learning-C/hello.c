#include <stdio.h> // "standard io" library

// This is a bread crumb, telling the compiler that the implementation is listed below
// Defining a function must happen before calling it
void meow(void);


void print_cube(int n)
{
    // For each row
    for (int x = 0; x < n; x++)
    {
        // For each column
        for (int x = 0; x < n; x++)
        {
            printf("#");
        }
        printf("\n")  ;  
    }
        
}

int main(void)
{
    const int FAVORITENUMBER = 8; // Declaring a constant is the same as a variable, just with the const keyword

    int counter = 0; // Declare a variable with the data type
    counter = counter + 1;
    printf("The counter value is %i.\n", counter); // %i is a placeholder for an integer
    //  %d also worked in the lecture...double?!
    //  %li (long integer) for integers over 2,000,000,000
    // %f for float
    // %.2f to round to two decimal points
    // %.5f to round to five decimal points

    printf("Hello, dude\n");

    // For loop syntax
    for (int i = 0; i < 3; i++)
    {
        meow();
    }

    print_cube(9);

    int scores[3]; // Declares an array of integers with 3 positions
    scores[0] = 77;
    scores[1] = 72;
    scores[2] = 33;

    // Print an average of these three scores
    printf("The average of these is %f\n", (scores[0] + scores[1] + scores[2]) / 3.0);
    


} // End main

// Here the function is actually implemented; must put a "bread crumb" line on top so the compiler
// understands that "meow()" is defined later in the code
void meow(void)
{
    printf("meow\n");
}



// Linux commands!:

// cd: change directory
// cp: copy
// ls: list
// mkdir: make directory
// rm: remove
// rmdir: remove directory

// cd .. gets you to the parent directory

// In the terminal below:
// Type "make hello" to make the file playable after saving it
// To execute the file, type "./hello"


// Data types: bool, string, int, char, double, float, long (aka long integer), and others
