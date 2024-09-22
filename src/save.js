/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps } from "@wordpress/block-editor";
import penguinLogo from "./logo.svg";
import { isbn13to10 } from "./functions";

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @return {Element} Element to render.
 */
export default function save({ attributes }) {
	const { title, bookData } = attributes;

	let bookAuthor1 =
		bookData && bookData.author.length ? bookData.author[0].authorDisplay : "";

	let bookAuthor2 =
		bookData && bookData.author.length > 1
			? `, \n` + bookData.author[1].authorDisplay
			: "";

	return (
		<div {...useBlockProps.save()}>
			<div className="bestseller-block">
				{bookData ? (
					<div className="bestseller-display">
						<h2>{title}</h2>
						<a
							href={"https://www.penguin.co.uk" + bookData.seoFriendlyUrl}
							target="_blank"
							rel="noopener"
						>
							<img
								src={
									"https://images.penguinrandomhouse.com/cover/" + bookData.isbn
								}
								alt={bookData.title}
							/>
						</a>
						<h3>{bookData.title}</h3>
						<p>
							<u>{bookAuthor1}</u>
							{bookAuthor2}
						</p>
						<a
							href={
								"https://www.amazon.co.uk/gp/product/" +
								isbn13to10(bookData.isbn.toString())
							}
							target="_blank"
							className="buy-button"
							rel="noopener"
						>
							Buy from Amazon
						</a>
						<div className="penguin-logo">
							<img
								src={penguinLogo}
								alt="Penguin logo"
								width="31"
								height="31"
							/>
						</div>
					</div>
				) : (
					""
				)}
			</div>
		</div>
	);
}
