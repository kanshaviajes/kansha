function RatingStars({ rating, setRating }) {
    return (
        <div className="rating-stars">

            {[1, 2, 3, 4, 5].map((star) => (

                <i
                    key={star}
                    className={`bi ${star <= rating ? "bi-star-fill active" : "bi-star"}`}
                    onClick={() => setRating(star)}
                />

            ))}

        </div>
    );
}

export default RatingStars;