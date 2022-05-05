# Welcome to Nawistha

Nawishta is a website aimed to help digitize and publish books with ease. It is primarily targetted to urdu language, however support for multiple languages in build into the platform and will be available in near futrure.

## Organization

Before we begin, we would like to define various parts of the Nawishta system so it is easier to refer to them later on.

#### Libraries

Nawishta is organized into Libraries. One or more libraries can exist at the same time. Library is a collection of books, magazine and other materials. 

#### Books
 
Book is the basic building block of the library. Each book consist of one or more chapters. A book can be written by one or more authors

#### Authors

Authors are the contributors to the library. An author should exist once inside a library and can be present in multiple libraries with same name. Authors can contributors to Books, Periodical articles as well as linked to individual publications.

Author can be poets or writers. This property only help us categorize and make authors search more relevent.

#### Categories

In order to help categorize books, categories are used. Categories are local to a library and can differ from libary to library. Multiple categories can be associated with a book. It works more like tag.

#### Series

Series are another way to organize the books present in a series. You can think of Harry Potter series as an example. Each series contains more than one books and there is an order to a book, called series Index. This feature help with discoverabiliy and allow more structured reading experience.

#### Peridicals

Periodical publications are different to books in the way they are written. Also periodicals have no spcific author and can have multiple publications. Hence they Periodical are created as separate entities in nawishta.

Each periodical represent a repeating publication and can be linked to one or more Issues of the periodical. Periodicals have certain publication cycle. Some example are Yearly, Month, Fortnightly and Weekly publication

#### Issues

Issues are the publications for a specific Periodical. As an example a monthly periodical can have issue for March, April, May and so on. Any issue is a collection of one or more Articles published in the issue. Each issue is identified by the Volume Number and Issue Number. 

#### Article

It represent the piece published in an issue. Each article is written by one or more authors.

## Accessing Nawishta

Currently nawishta is a private repository or libraries. You need to register with the website and it is only possible through an invite. 

Once you ask for invitation, you can be invited to a library. On getting invitation you would need to sign up using the email you provided and only than you will only be permitted to access only the specific library. Getting invited to other libraries is again the same invitation proces but you would not need to signup again, so it is important to use same email address when asking for invites.

### Roles and responsibilities

You access level in library is defined by your role in the library. You can posess one of the following roles:

- Reader.  As name suggests, you are only allowed to read books present in the library and you cannot make any modification to the library
- Writer. As a writer you can participate in digitizing the books. You can create books but you are not allowed to delete books as well as you are not allowed to create define more generic features like categories. As one might expect, Writers inherits all permissions of a reader.
- Library Adminitrator. As a library admin, you have full control over the library and all aspects of it. You can not only contribute to digitization of books, as a Write role would do, but you are also responsible for managing users, categories and roles of the library. This is the highest permission level that a user can have in a library.
- System Administrator. This is a special role that is cross library and have Library administrator role on all Libraries in nawishta. This role can create, update and delete libraries as well.

## Accessing website

Nawishta is a private site and does not allow anonymous browsing. You need to get an account and login to website to use it. See [security page](./Security.md) for details. 

If you already have an account [Home Page](./homepage.md) for details on various features of website.
