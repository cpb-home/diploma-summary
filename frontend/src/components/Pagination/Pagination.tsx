import React from "react";
import Button from "../../ui/Button";

type PaginationProps = {
  onNextPageClick: () => void;
  onPrevPageClick: () => void;
  disable: {
    left: boolean;
    right: boolean;
  };
  nav?: {
    current: number;
    total: number;
  };
};

const Pagination = (props: PaginationProps) => {
  const { nav = null, disable, onNextPageClick, onPrevPageClick } = props;

  const handleNextPageClick = () => {
    onNextPageClick();
  }

  const handlePrevPageClick = () => {
    onPrevPageClick();
  }

  return (
    <div className="paginator">
      {<Button
        type='button'
        handler={handlePrevPageClick}
        text='<'
        disabled={disable.left}
      />}

      {nav && (
        <span className="paginator__navigation">
          {nav.current} / {nav.total}
        </span>
      )}

      {<Button 
        type='button'
        handler={handleNextPageClick}
        text='>'
        disabled={disable.right}
      />}
    </div>
  )
}

export default React.memo(Pagination);

/*
return (
    <div className="paginator">
      <button
        className="paginator__arrow" 
        type="button"
        onClick={handlePrevPageClick}
        disabled={disable.left}
      >
        {'< Предыдущие ' + perPage}
      </button>

      {nav && (
        <span className="paginator__navigation">
          {nav.current} / {nav.total}
        </span>
      )}

      <button
        className="paginator__arrow" 
        type="button"
        onClick={handleNextPageClick}
        disabled={disable.right}
      >
        {'Следующие ' + perPage + ' >'}
      </button>
    </div>
  )
}
*/