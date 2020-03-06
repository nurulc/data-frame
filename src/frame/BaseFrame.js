/**
 *  Used to from the base class for a Frame,
 *  This is added to break circular import reference from hasFrame(aFrame) function
 *  Originally hasFrame imported frame and frame imported hasFrame. In order to break taht up
 *  we now include BaseFrame from both Frame and hasFrame.
 *  
 */
export default class BaseFrame {
	
}