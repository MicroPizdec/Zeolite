import { Model, Table, Column, DataType } from 'sequelize-typescript';

@Table
export default class Languages extends Model {
  @Column(DataType.STRING)
  userID: string;

  @Column({
    type: DataType.STRING,
    defaultValue: 'en',
  })
  language: string;
}
