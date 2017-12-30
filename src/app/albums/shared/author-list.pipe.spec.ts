import { AuthorListPipe } from './author-list.pipe';

describe('AuthorListPipe', () => {
  let pipe: AuthorListPipe;

  beforeEach(() => {
    pipe = new AuthorListPipe();
  });

  it('should return empty string on empty user list', () => {
    const users = [];

    expect(pipe.transform(users)).toEqual('');
  });

  it('should return the name of a single user', () => {
    const users = [{ id: 1, username: 'Toto' }];

    expect(pipe.transform(users)).toEqual('Toto');
  });

  it('should return the comma separated names of multiple users', () => {
    const users = [{ id: 1, username: 'Toto' }, { id: 2, username: 'Titi' }, { id: 3, username: 'Tata' }];

    expect(pipe.transform(users)).toEqual('Toto, Titi, Tata');
  });
});