import React from 'react';
// Import the original mapper
import MDXComponents from '@theme-original/MDXComponents';
/** Import built-in Docusaurus components at the global level
 * so we don't have to re-import them in every file
 */

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

// Import custom components, globally as well
import Request from '../components/Request';
import Response from '../components/Response';
import ApiCall from '../components/ApiCall';
import SubtleCallout from '../components/SubtleCallout';
import CustomDocCard from '../components/CustomDocCard';
import CustomDocCardsWrapper from '../components/CustomDocCardsWrapper';

export default {
  // Re-use the default mapping
  ...MDXComponents,

  /**
   * Components below are imported within the global scope,
   * meaning you don't have to insert the typical 'import SomeStuff from '/path/to/stuff' line
   * at the top of a Markdown file before being able to use these components
   *  — see https://docusaurus.io/docs/next/markdown-features/react#mdx-component-scope
   */
  Request,
  Response,
  ApiCall,
  Tabs,
  TabItem,
  SubtleCallout,
  CustomDocCard,
  CustomDocCardsWrapper,
};
