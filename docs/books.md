# Books Page

Book page allows you to navigate and find books. This page can be accessed using the books link on the toolbar. By default you are shown the list of published bookes order by title.

![image](https://user-images.githubusercontent.com/8446759/166978544-e30fb24f-0ca3-44a7-9783-063584e07db0.png)

Books are shown as Card or List view. This can be toggled using the view button on the top of the list. The selection is persisted in the browser and next time you visit the page your previous page view selection would be used.

![image](https://user-images.githubusercontent.com/8446759/166979537-0fc9d017-fe09-4c6c-82b8-e421d2865672.png)

## Card View

By default each book is presented as a card on the UI. You can see different options on the book.

![image](https://user-images.githubusercontent.com/8446759/166977599-c514b4f9-e66a-41bf-a516-e39e2a29e781.png)

Details of various parts of a book card are shown below:

1. **Book Front Page**. It is the image shown on the title of book. Clicking image will open the book details.
2. **Catergories** for the book. Clicking on the categories label will show books in the category.
3. **Authors**. If more than one authors for the book their images as shown next to each other. Clicking on the image will show [author page](./authors.md).
4. **Title** of the book.  Clicking title will open the book details.
5. **Description** is the short introduction to the book. Long descriptions are trimmed for better viwe experience.
6. **Actions bar**. The contents of the actions bar depends on users access level. Generally an Writer will see Edit button to edit the book and delete button to remove the book. All users see a favorite buttton. This button shows red if the book is already marked favorite by user. This button can be clicked to add or remove depending on its status.   

## List View

Some users find it pleasing to see more details about the book. Such users can use the list view mode۔

![image](https://user-images.githubusercontent.com/8446759/166981010-ddeec6a4-f49d-4971-9e25-da9932261742.png)

Details of various parts of a book list item are shown below:

1. **Book Front Page**. It is the image shown on the title of book. Clicking image will open the book details.
2. **Title** of the book. Clicking title will open the book details.
3. **Authors**. If more than one authors for the book their images as shown next to each other. Clicking on the image will show [author page](./authors.md).
4. **Description** is the short introduction to the book. Long descriptions are trimmed for better viwe experience.
5. **Catergories** for the book. Clicking on the categories label will show books in the category.
6. **Actions bar**. The contents of the actions bar depends on users access level. Generally an Writer will see Edit button to edit the book and delete button to remove the book. All users see a favorite buttton. This button shows red if the book is already marked favorite by user. This button can be clicked to add or remove depending on its status.   

## Pagination

When the result set contains more books than what can be displayed on the screen pagination toolbar appears on the bottom of the screen. User can use it to navigate between different pages of result.

![image](https://user-images.githubusercontent.com/8446759/166982778-724d1df7-3214-4995-9755-c54c17bb5498.png)

## Categories

Towards the left side of the page, list of various categories is shown. It also shows the number of books available in the category for the given filter. User can click on the filter to see books in a certain category.

![image](https://user-images.githubusercontent.com/8446759/166982876-9093f31d-0a44-4902-aed0-396f2c07eb1f.png)


## Searching

User can search for a spcific title using the search in the bar on the top of the list. User can click on the search box, type the text to search and press enter to perform the search.

![image](https://user-images.githubusercontent.com/8446759/166981495-47f5e79a-25d4-4284-8b0e-863f264daf39.png)

## Sorting

By default books shown are sorted by the title. User can change the sorting order by using the sort button on the bar on top of the list:

![image](https://user-images.githubusercontent.com/8446759/166981903-d3c167e0-28b6-4732-84a3-77fc8f058b3e.png)

Books can be sorted by Title or Added Date. User can select the ascending and descending order.

## Filters

You can change change the filters and order by using the filter menu

![image](https://user-images.githubusercontent.com/8446759/166976425-cd2bd151-46ff-44e8-8686-963ddf522061.png)

The options available in menu will vary based on your access level. This screenshot shows the options that a Writer see. Some description of these filters is as follows:

### Favorite

Favorite filter will show book that are marked as your favorite. You can mark the book as favorite using the the favorite button on the book list item or from book detail page.

### Read

It shows only books that are read by the user. When user open book in reader view, it is automatically added to the user read list of book.

### Unread

Shows only the books not read by user.

### Filter book by status

For Writer users there are extra options shown in the filter dropdown. User can select the books that are in differnet stages of digitization.



## Creating books

New books can be added by using the Create book button. This button is only available to Writers and Administrators.

![image](https://user-images.githubusercontent.com/8446759/166982509-0386f987-1f1a-4080-8d5f-324b69e876d0.png)

