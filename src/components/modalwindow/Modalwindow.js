import './modalwindow.styl';

import React from 'react';
import classNames from 'classnames';

const ModalWindow = props => {
  const classes = classNames(
    'modalwindow',
    {
      'shown': props.isShown
    });

  return (
    <div className={classes}>
      <header>{props.title}</header>
      <section>
        {props.children}
      </section>
      <footer>
        { props.cancel.text && <button onClick={props.cancel.action}>{props.cancel.text}</button>}
        { props.ok.text && <button onClick={props.ok.action}>{props.ok.text}</button>}
      </footer>
    </div>
  );
};

export default ModalWindow;
