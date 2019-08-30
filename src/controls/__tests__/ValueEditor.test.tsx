import { mount, shallow } from 'enzyme';
import React from 'react';
import sinon from 'sinon';
import { ValueEditor } from '..';

const handleOnChange = () => null;

describe('<ValueEditor />', () => {
  it('should exist', () => {
    expect(ValueEditor).to.exist;
  });

  describe('when using default rendering', () => {
    it('should have an <input /> element', () => {
      const dom = shallow(<ValueEditor handleOnChange={handleOnChange} className="" level={0} />);
      expect(dom.find('input')).to.have.length(1);
    });

    it('should have the value passed into the <input />', () => {
      const dom = shallow(
        <ValueEditor value="test" handleOnChange={handleOnChange} className="" level={0} />
      );
      expect(dom.find('input').props().value).to.equal('test');
    });

    it('should render nothing for operator "null"', () => {
      const dom = shallow(
        <ValueEditor operator="null" handleOnChange={handleOnChange} className="" level={0} />
      );
      expect(dom.type()).to.be.null;
    });

    it('should render nothing for operator "notNull"', () => {
      const dom = shallow(
        <ValueEditor operator="notNull" handleOnChange={handleOnChange} className="" level={0} />
      );
      expect(dom.type()).to.be.null;
    });

    it('should call the onChange method passed in', () => {
      let count = 0;
      const mockEvent = { target: { value: 'foo' } };
      const onChange = () => count++;
      const dom = shallow(<ValueEditor handleOnChange={onChange} className="" level={0} />);

      dom.find('input').simulate('change', mockEvent);
      expect(count).to.equal(1);
    });
  });

  describe('when rendering a select', () => {
    it('should render the correct number of options', () => {
      const wrapper = mount(
        <ValueEditor
          type="select"
          values={[{ name: 'test', label: 'Test' }]}
          handleOnChange={handleOnChange}
          className=""
          level={0}
        />
      );

      const select = wrapper.find('select');
      expect(select.length).to.equal(1);

      const opts = wrapper.find('select option');
      expect(opts.length).to.equal(1);
    });

    it('should call the onChange method passed in', () => {
      const onChange = sinon.spy();
      const wrapper = mount(
        <ValueEditor
          type="select"
          handleOnChange={onChange}
          values={[{ name: 'test', label: 'Test' }]}
          className=""
          level={0}
        />
      );

      const select = wrapper.find('select');
      select.simulate('change', { target: { value: 'test' } });
      expect(onChange.calledOnceWith('test')).to.equal(true);
    });
  });

  describe('when rendering a checkbox', () => {
    it('should render the checkbox and react to changes', () => {
      const onChange = sinon.spy();
      const wrapper = mount(
        <ValueEditor type="checkbox" handleOnChange={onChange} className="" level={0} />
      );

      const checkbox = wrapper.find('input[type="checkbox"]');
      expect(checkbox.length).to.equal(1);

      wrapper.simulate('change', { target: { checked: true } });
      expect(onChange.calledOnceWith(true)).to.equal(true);
    });
  });

  describe('when rendering a radio button set', () => {
    it('should render the radio buttons with labels', () => {
      const wrapper = mount(
        <ValueEditor
          type="radio"
          values={[{ name: 'test', label: 'Test' }]}
          handleOnChange={handleOnChange}
          className=""
          level={0}
        />
      );

      const input = wrapper.find('label input[type="radio"]');
      expect(input.length).to.equal(1);
    });

    it('should call the onChange handler', () => {
      const onChange = sinon.spy();
      const wrapper = mount(
        <ValueEditor
          type="radio"
          handleOnChange={onChange}
          values={[{ name: 'test', label: 'Test' }]}
          className=""
          level={0}
        />
      );

      const input = wrapper.find('input');
      input.simulate('change', { target: { value: 'test' } });
      expect(onChange.calledOnceWith('test')).to.equal(true);
    });
  });
});
