import 'dotenv/config';
import { partOne } from './src/1_part___one';
import { partTwo } from './src/2_part___agent';
import { partThree } from './src/3_part___function_calling';
import { partFour } from './src/4_part___agent_loop';
//
import { realTools } from './src/5_real_tools';
import { partSix } from './src/6_part___optimize';
//

// -------------------------------------------------

// - One of   (no memory)

// - Chat based (memory (we used db))

// - Chat based with system message

// partOne();
// -------------------------------------------------
// -------------------------------------------------
//
// - Part 2
// - in this case we are dealing with tool call

// response from the ai can have content or tool_calls

// if it has content, it's a normal response
// if it has tool_calls, it's a tool call
// can't have both

// - we created couple of tools
// - ai should determine if it's good idea to use the tool or not

// - based on the prompt ai decides to call the tool or not
// - if it does, it will return the tool call id and arguments

// - ai will tell us that we need to call the function associated with the tool call

// we didn't save the massages in the history (actually we did since
// this error is helpful for learning)
// since
// in case of response of tool call
// If I would save it in db, it would produce error
// since the message is not valid

// valid message that we would save would be after calling the function
// and that would be valid message
// message would be of role "tool"
// and content would be the result of the function
// and id needs to be the same as the tool call id

// - content is null in case of tool call
// and we have another thing called refusal
// - refusal in the response of tool call
// we can use it to check if the tool call was successful
// or not

// partTwo();
// -------------------------------------------------
// -------------------------------------------------

// - Part 3

// - continuation of part 2
// - we are going to handle response of tool call
// - we are going to call the function and save the result

// like I said once
// response from the ai can have content or tool_calls

// if it has content, it's a normal response
// if it has tool_calls, it's a tool call
// can't have both

// - we also defined new function inside memory file
// that handles saving the result of the tool response

// partThree();

// -------------------------------------------------
// -------------------------------------------------

// - Part 4

// - continuation of part 3

// lets start on the place where we didn't see any
// message from the actual function of the tool

// we will create a loop that will keep running until
// we get the response from the tool

// partFour();

// ---------------------------------------------------
// ---------------------------------------------------
// ---------------------------------------------------
// ---------------------------------------------------
// ---------------------------------------------------
// ------ Real Tools (Part 5)
// ---------------------------------------------------
// ---------------------------------------------------
// ---------------------------------------------------

// realTools();

// ---------------------------------------------------
// ---------------------------------------------------
// ---------------------------------------------------
// ---------------------------------------------------
// ---------------------------------------------------
//  part 6  -  optimizations

partSix();

// - we built system prompt
