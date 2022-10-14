import { useState, render } from '@wordpress/element';
import { Button, TextareaControl, TextControl, Spinner, Flex } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { store as coreDataStore } from '@wordpress/core-data';
import { decodeEntities } from '@wordpress/html-entities';
import { date } from '@wordpress/date';
import { removep } from '@wordpress/autop';



function QuickDraft() {
	const posts = useSelect(
		select =>
			select( coreDataStore ).getEntityRecords( 'postType', 'post', { status: 'draft', per_page: 3 } ),
		[]
	);
    return (
		<div>

			<NewDraftForm />

			<hr />

			<PostsList posts={ posts } />
		</div>
	);
}

function NewDraftForm() {
	const [title, setTitle ] = useState();
	const [content, setContent ] = useState();

	const { saveEntityRecord } = useDispatch( coreDataStore );
	const handleSave = async () => {
		const savedRecord = await saveEntityRecord(
			'postType',
			'post',
			{ title, content }
		);
		if ( savedRecord ) {
			alert( 'It worked!' );
		}
	}

	const { lastError, isSaving } = useSelect(
		( select ) => ({
			lastError: select( coreDataStore ).getLastEntitySaveError( 'postType', 'post' ),
			isSaving: select( coreDataStore ).isSavingEntityRecord( 'postType', 'post' ),
		}),
		[]
	)


	return (
		<div>
			<TextControl label="Title" value={ title } onChange={ ( value ) => setTitle( value ) } />

			<TextareaControl label="Content" value={ content } onChange={ ( value ) => setContent( value ) } />

			{ lastError ? (
                <div className="form-error">
                    Error: { lastError.message }
                </div>
            ) : false }

			<Button variant="primary" onClick={ handleSave } disabled={ isSaving }>
				{ isSaving ? (
					<>
						<Spinner/>
						Saving
					</>
				) : 'Save Draft' }
			</Button>
		</div>
	);
}


function PostsList( { posts } ) {
	return (
		<div>
			<Flex>
				<h2>Your Recent Drafts</h2>
				<a href="/wp-admin/edit.php?post_status=draft">View all drafts</a>
			</Flex>
			<ul>
				{ posts ? (
					posts?.map( post => (
						<PostListItem post={ post } />
					))
					) : (
						<>
							<Spinner/>
						</>
					)
				}
			</ul>
		</div>
	)
}


function PostListItem( { post } ) {
	const excerpt = post.excerpt.rendered.split( '[&#8230;]' );
	return (
		<li key={post.id }>
			<div>
				<a href={ 'post.php?post=' + post.id + '&action=edit' }>
					{ post.title.rendered ? decodeEntities( post.title.rendered ) : '(no title)' }
				</a>&nbsp;
				<time>{ date('F j, Y', post.date ) }</time>
			</div>
			{  removep( decodeEntities( excerpt[0] ) ) }
		</li>
	)
}

window.addEventListener(
    'load',
    function () {
        render(
            <QuickDraft />,
            document.querySelector( '#quick-draft-demo' )
        );
    },
    false
);
