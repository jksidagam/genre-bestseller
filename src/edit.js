/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from "@wordpress/i18n";

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useState, useEffect } from "@wordpress/element";
import { InspectorControls, useBlockProps } from "@wordpress/block-editor";
import {
	PanelBody,
	ComboboxControl,
	TextControl,
	Icon,
} from "@wordpress/components";
import { chevronDown } from "@wordpress/icons";
import apiFetch from "@wordpress/api-fetch";
import { isbn13to10 } from "./functions";

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import "./editor.scss";
import penguinLogo from "./logo.svg";

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit({ attributes, setAttributes }) {
	const { genre, title, bookData } = attributes;
	const [genres, setGenres] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	let bookAuthor1 =
		bookData && bookData.author.length ? bookData.author[0].authorDisplay : "";

	let bookAuthor2 =
		bookData && bookData.author.length > 1
			? `, \n` + bookData.author[1].authorDisplay
			: "";

	// Fetch genres from Biblio API on mount
	useEffect(() => {
		setLoading(true);

		apiFetch({
			path: "/biblio-api/v1/genres",
		})
			.then((genresResponse) => {
				let genresOptions = genresResponse.data.categories.map((g) => ({
					label: g.menuText,
					value: g.catUri,
				}));
				setGenres(genresOptions);
				console.log(genresResponse.data.categories);
				setError("");
			})
			.catch(() => setError("Error fetching genres"));
	}, []);

	// Fetch the best-selling book when the genre changes
	useEffect(() => {
		if (genre) {
			setLoading(true);
			apiFetch({
				path: `/biblio-api/v1/genres/bestsellers?genre=${genre}`,
			})
				.then((booksResponse) => {
					setAttributes({ bookData: booksResponse.data.works[0] });
					console.log(booksResponse.data.works[0]);
					setLoading(false);
					setError("");
				})
				.catch(() => {
					setError("Book not available");
					setLoading(false);
				});
		}
	}, [genre]);

	return (
		<div {...useBlockProps()}>
			<InspectorControls>
				<PanelBody title="Block Options">
					<ComboboxControl
						label="Genre"
						value={genre}
						onChange={(selectedGenre) =>
							setAttributes({ genre: selectedGenre })
						}
						options={genres ? genres : loading && <p>Loading...</p>}
					/>
					<TextControl
						label="Title"
						value={title}
						onChange={(newTitle) => setAttributes({ title: newTitle })}
					/>
				</PanelBody>
			</InspectorControls>

			<div className="bestseller-block">
				{bookData && !error ? (
					<div className="bestseller-display">
						<h2>{title}</h2>
						<a
							href={"https://www.penguin.co.uk" + bookData.seoFriendlyUrl}
							target="_blank"
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
					<ComboboxControl
						label="Choose a genre..."
						value={genre}
						onChange={(newGenre) => setAttributes({ genre: newGenre })}
						options={genres}
					/>
				)}
				{error && <p>Book not available.</p>}
			</div>
		</div>
	);
}
