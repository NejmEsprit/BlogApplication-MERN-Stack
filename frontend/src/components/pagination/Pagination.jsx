import "./pagination.css"
const Pagination = ({ pages, currentPage, setCurrentPage }) => {
    const generatedPages = [];
    for (let i = 1; i <= pages; i++) {
        generatedPages.push(i)
    }
    return (
        <div className="pagination">
            <button
                onClick={() => setCurrentPage(current => current - 1)}
                disabled={currentPage === 1}
                className="page previous"
            >Previous</button>
            {generatedPages.map(page => (
                <div
                    onClick={() => setCurrentPage(page)}
                    key={page}
                    className={currentPage === page ? "page active" : "page"} >
                    {page}
                </div>
            ))
            }
            <button
                onClick={() => setCurrentPage(current => current + 1)}
                disabled={currentPage === pages}
                className="page next ">Next</button>
        </div >
    );
}

export default Pagination;