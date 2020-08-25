//-------------------------------------------------------------------------------
// This is the enzyme config file consumed by Jest. Allows for the use of
// Enzyme. Note that all methods are defined in the global scope so they
// don't need to be imported in the test files.
//
//-------------------------------------------------------------------------------

//-------------------------------------------------------------------------------
// Import Directives
//-------------------------------------------------------------------------------

import Enzyme, { shallow, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

//-------------------------------------------------------------------------------
// Define the new Adapter and make methods available globally
//-------------------------------------------------------------------------------

Enzyme.configure({ adapter: new Adapter() });

global.shallow = shallow;
global.render = render;
global.mount = mount;
